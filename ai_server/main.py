from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import logging
import joblib
import json
import numpy as np
from typing import List, Dict, Optional
from contextlib import asynccontextmanager

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables for Sorting Hat
sorting_hat_model = None
sorting_hat_questions = None

# Load Sorting Hat model and questions on startup
def load_sorting_hat_resources():
    global sorting_hat_model, sorting_hat_questions
    
    try:
        # Try to load enhanced model first
        enhanced_model_path = os.path.join("..", "Sorting_Hat", "enhanced_sorting_hat_model.joblib")
        if not os.path.exists(enhanced_model_path):
            enhanced_model_path = os.path.join("enhanced_sorting_hat_model.joblib")
        
        if os.path.exists(enhanced_model_path):
            sorting_hat_model = joblib.load(enhanced_model_path)
            logger.info("Enhanced Sorting Hat model loaded successfully")
        else:
            # Fallback to basic model
            model_path = os.path.join("..", "Sorting_Hat", "sorting_hat_model.joblib")
            if not os.path.exists(model_path):
                model_path = os.path.join("sorting_hat_model.joblib")
            
            if os.path.exists(model_path):
                sorting_hat_model = {'model': joblib.load(model_path), 'model_type': 'basic'}
                logger.info("Basic Sorting Hat model loaded successfully")
            else:
                logger.warning("No Sorting Hat model found")
        
        # Try to load questions
        questions_path = os.path.join("..", "Sorting_Hat", "structured_questions.json")
        if not os.path.exists(questions_path):
            questions_path = os.path.join("structured_questions.json")
        
        if os.path.exists(questions_path):
            with open(questions_path, 'r') as f:
                sorting_hat_questions = json.load(f)
            logger.info(f"Loaded {len(sorting_hat_questions)} Sorting Hat questions")
        else:
            logger.warning("Sorting Hat questions not found")
            
    except Exception as e:
        logger.error(f"Failed to load Sorting Hat resources: {e}")

def create_interaction_features_dict(traits):
    """Create interaction features from basic traits"""
    # Default values for missing traits (if only basic 4 are provided)
    full_traits = {
        'bravery_score': traits.get('bravery_score', 5),
        'wisdom_score': traits.get('wisdom_score', 5), 
        'ambition_score': traits.get('ambition_score', 5),
        'loyalty_score': traits.get('loyalty_score', 5),
        'leadership': traits.get('leadership', 5),
        'impulsiveness': traits.get('impulsiveness', 5),
        'justice_oriented': traits.get('justice_oriented', 5),
        'risk_taking': traits.get('risk_taking', 5)
    }
    
    # Create interaction features
    result = full_traits.copy()
    
    result['bravery_loyalty_ratio'] = full_traits['bravery_score'] / (full_traits['loyalty_score'] + 0.1)
    result['wisdom_ambition_ratio'] = full_traits['wisdom_score'] / (full_traits['ambition_score'] + 0.1)
    result['leadership_potential'] = (full_traits['leadership'] + full_traits['bravery_score'] + full_traits['ambition_score']) / 3
    result['moral_flexibility'] = 10 - full_traits['justice_oriented']
    result['calculated_thinking'] = (full_traits['wisdom_score'] + (10 - full_traits['impulsiveness'])) / 2
    result['courage_type'] = full_traits['bravery_score'] * full_traits['risk_taking'] / 10
    
    # House-specific composites
    result['gryffindor_composite'] = (full_traits['bravery_score'] * 0.3 + full_traits['justice_oriented'] * 0.25 + 
                                     full_traits['loyalty_score'] * 0.25 + full_traits['risk_taking'] * 0.2)
    result['hufflepuff_composite'] = (full_traits['loyalty_score'] * 0.4 + full_traits['justice_oriented'] * 0.25 + 
                                     (10 - full_traits['ambition_score']) * 0.2 + (10 - full_traits['impulsiveness']) * 0.15)
    result['ravenclaw_composite'] = (full_traits['wisdom_score'] * 0.35 + result['calculated_thinking'] * 0.25 + 
                                    full_traits['ambition_score'] * 0.2 + full_traits['leadership'] * 0.2)
    result['slytherin_composite'] = (full_traits['ambition_score'] * 0.35 + full_traits['leadership'] * 0.25 + 
                                    full_traits['wisdom_score'] * 0.2 + result['moral_flexibility'] * 0.2)
    
    return result

# Sorting Hat Akinator class
class SortingHatAkinator:
    def __init__(self, questions, model):
        self.questions = questions
        self.model = model
        self.user_scores = {'Gryffindor': 0, 'Hufflepuff': 0, 'Ravenclaw': 0, 'Slytherin': 0}
        self.asked_questions = []
        self.answer_history = {}  # Track which answers were selected for each question
        
    def reset(self):
        """Reset the game state"""
        self.user_scores = {'Gryffindor': 0, 'Hufflepuff': 0, 'Ravenclaw': 0, 'Slytherin': 0}
        self.asked_questions = []
        self.answer_history = {}
    
    def get_next_question(self):
        """Get the next best question to ask based on current scores"""
        if len(self.asked_questions) >= len(self.questions):
            return None
            
        available_questions = [q for q in self.questions if q['id'] not in self.asked_questions]
        
        if not available_questions:
            return None
            
        return available_questions[0]
    
    def answer_question(self, question_id, answer_index):
        """Process an answer and update scores"""
        question = next((q for q in self.questions if q['id'] == question_id), None)
        if not question or answer_index >= len(question['options']):
            return False
            
        answer = question['options'][answer_index]
        
        # Update scores
        for house, score in answer['scores'].items():
            self.user_scores[house] += score
            
        # Record the answer for pattern analysis
        self.answer_history[question_id] = {
            'answer_index': answer_index,
            'answer_text': answer['text'],
            'scores': answer['scores']
        }
            
        self.asked_questions.append(question_id)
        return True
    
    def calculate_trait_scores(self):
        """Calculate trait scores based on house scores and questions answered with weighted importance"""
        if len(self.asked_questions) == 0:
            return None
            
        # Enhanced scoring system with question weights and strategic calculations
        total_questions = len(self.asked_questions)
        
        # Apply question-specific weights (some questions are more important for certain traits)
        weighted_scores = self.apply_question_weights()
        
        # Calculate normalized scores (0-10 scale)
        max_weighted_score = sum(self.get_question_weight(q_id) * 2 for q_id in self.asked_questions)
        
        if max_weighted_score == 0:
            max_weighted_score = 1  # Prevent division by zero
        
        # Calculate base trait scores with enhanced scaling
        bravery_raw = (weighted_scores['Gryffindor'] / max_weighted_score) * 100
        loyalty_raw = (weighted_scores['Hufflepuff'] / max_weighted_score) * 100
        wisdom_raw = (weighted_scores['Ravenclaw'] / max_weighted_score) * 100
        ambition_raw = (weighted_scores['Slytherin'] / max_weighted_score) * 100
        
        # Apply competitive scaling to increase differentiation
        total_raw = bravery_raw + loyalty_raw + wisdom_raw + ambition_raw
        if total_raw > 0:
            bravery_norm = (bravery_raw / total_raw) * 40  # Scale to 0-40 range
            loyalty_norm = (loyalty_raw / total_raw) * 40
            wisdom_norm = (wisdom_raw / total_raw) * 40
            ambition_norm = (ambition_raw / total_raw) * 40
        else:
            bravery_norm = loyalty_norm = wisdom_norm = ambition_norm = 10
        
        # Add base offset and ensure minimum differentiation
        bravery_score = max(1, min(10, int(bravery_norm / 4) + 2))
        loyalty_score = max(1, min(10, int(loyalty_norm / 4) + 2))
        wisdom_score = max(1, min(10, int(wisdom_norm / 4) + 2))
        ambition_score = max(1, min(10, int(ambition_norm / 4) + 2))
        
        # Apply trait boosts based on specific answer patterns
        trait_scores = {
            'bravery_score': bravery_score,
            'loyalty_score': loyalty_score,
            'wisdom_score': wisdom_score,
            'ambition_score': ambition_score
        }
        
        # Apply answer pattern bonuses
        trait_scores = self.apply_pattern_bonuses(trait_scores)
        
        return trait_scores
    
    def get_question_weight(self, question_id):
        """Get the importance weight for a specific question"""
        # Define question weights - some questions are more decisive
        question_weights = {
            'Q01': 3.0,  # "What would you hate to be called?" - Core personality
            'Q04': 2.8,  # "How would you like to be known?" - Core values
            'Q07': 2.5,  # "Bridge with troll" - Action under pressure
            'Q13': 2.5,  # "Which quote resonates?" - Philosophy
            'Q12': 2.2,  # "Dangerous plant cure" - Moral choices
            'Q03': 2.0,  # "Troll in headmaster's study" - Priorities
            'Q15': 3.0,  # "Hatstall tie-breaker" - Direct house preference
            'Q09': 2.0,  # "Potion guarantee" - Desires (increased for Slytherin)
            'Q14': 2.2,  # "What power?" - Ambition type (increased for Slytherin)
            'Q11': 1.8,  # "Locked chest key" - Approach to mystery (increased for cunning)
            'Q02': 1.5,  # "Enchanted garden" - Curiosity type
            'Q08': 1.3,  # "Which path tempts?" - Risk preference
            'Q10': 1.7,  # "After death legacy" - Values
            'Q05': 1.2,  # "Dawn or Dusk" - General preference
            'Q06': 1.2,  # "Forest or River" - General preference
        }
        return question_weights.get(question_id, 1.0)
    
    def apply_question_weights(self):
        """Apply weights to house scores based on question importance"""
        weighted_scores = {'Gryffindor': 0, 'Hufflepuff': 0, 'Ravenclaw': 0, 'Slytherin': 0}
        
        for question_id in self.asked_questions:
            if question_id in self.answer_history:
                answer_data = self.answer_history[question_id]
                weight = self.get_question_weight(question_id)
                
                for house, score in answer_data['scores'].items():
                    weighted_scores[house] += score * weight
        
        return weighted_scores
    
    def apply_pattern_bonuses(self, trait_scores):
        """Apply bonuses based on answer patterns that strongly indicate specific houses"""
        
        # Analyze answer patterns for house indicators
        gryffindor_indicators = 0
        hufflepuff_indicators = 0
        ravenclaw_indicators = 0
        slytherin_indicators = 0
        
        # Check for specific Gryffindor patterns
        if 'Q01' in self.answer_history:
            # "What would you hate to be called?"
            answer_text = self.answer_history['Q01']['answer_text']
            if 'Cowardly' in answer_text:
                gryffindor_indicators += 2  # Strong Gryffindor indicator
            elif 'Ignorant' in answer_text:
                ravenclaw_indicators += 2  # Strong Ravenclaw indicator
            elif 'Selfish' in answer_text:
                hufflepuff_indicators += 1
            elif 'Ordinary' in answer_text:
                slytherin_indicators += 2  # Slytherins hate being ordinary
                
        if 'Q02' in self.answer_history:
            # "Enchanted garden - what interests you?"
            answer_text = self.answer_history['Q02']['answer_text']
            if 'bubbling pool' in answer_text and 'luminous' in answer_text:
                slytherin_indicators += 1  # Mysterious, potentially powerful
            elif 'silver-leafed tree' in answer_text:
                gryffindor_indicators += 1
            elif 'talking toadstools' in answer_text:
                hufflepuff_indicators += 1
            elif 'statue' in answer_text and 'twinkling eye' in answer_text:
                ravenclaw_indicators += 1
                
        if 'Q03' in self.answer_history:
            # "Troll in headmaster's study - rescue order"
            answer_text = self.answer_history['Q03']['answer_text']
            if 'book of strange runes' in answer_text:
                # If runes come first, shows priority for knowledge/power
                if answer_text.startswith('The book of strange runes'):
                    slytherin_indicators += 1
                    ravenclaw_indicators += 1
                
        if 'Q04' in self.answer_history:
            # "How would you like to be known to history?"
            answer_text = self.answer_history['Q04']['answer_text']
            if 'Bold' in answer_text:
                gryffindor_indicators += 2
            elif 'Great' in answer_text:
                slytherin_indicators += 2  # Ambition for greatness
            elif 'Wise' in answer_text:
                ravenclaw_indicators += 2
            elif 'Good' in answer_text:
                hufflepuff_indicators += 2
                
        if 'Q05' in self.answer_history:
            # "Dawn or Dusk?"
            answer_text = self.answer_history['Q05']['answer_text']
            if 'Dusk' in answer_text:
                slytherin_indicators += 1  # Associated with mystery, night
                ravenclaw_indicators += 1
            elif 'Dawn' in answer_text:
                gryffindor_indicators += 1
                hufflepuff_indicators += 1
                
        if 'Q06' in self.answer_history:
            # "Forest or River?"
            answer_text = self.answer_history['Q06']['answer_text']
            if 'River' in answer_text:
                slytherin_indicators += 1  # Water is Slytherin element
            elif 'Forest' in answer_text:
                hufflepuff_indicators += 1
                
        if 'Q07' in self.answer_history:
            # "Bridge with troll - what do you do?"
            answer_text = self.answer_history['Q07']['answer_text']
            if 'Volunteer to fight' in answer_text:
                gryffindor_indicators += 2
            elif 'drawing lots' in answer_text:
                hufflepuff_indicators += 1
            elif 'confuse the troll' in answer_text:
                ravenclaw_indicators += 1
                slytherin_indicators += 1  # Cunning approach
            elif 'fight together' in answer_text:
                slytherin_indicators += 2  # Strategic group approach
                
        if 'Q08' in self.answer_history:
            # "Which path tempts you most?"
            answer_text = self.answer_history['Q08']['answer_text']
            if 'narrow, dark, lantern-lit alley' in answer_text:
                slytherin_indicators += 2  # Dark, mysterious path
                ravenclaw_indicators += 1
            elif 'wide, sunny, grassy lane' in answer_text:
                hufflepuff_indicators += 1
                gryffindor_indicators += 1
            elif 'twisting, leaf-strewn path' in answer_text:
                ravenclaw_indicators += 1
            elif 'cobbled street' in answer_text and 'ancient buildings' in answer_text:
                slytherin_indicators += 1  # History and tradition
                
        if 'Q09' in self.answer_history:
            # "Potion guarantee - what would you choose?"
            answer_text = self.answer_history['Q09']['answer_text']
            if 'Power' in answer_text:
                slytherin_indicators += 3  # Core Slytherin desire
            elif 'Glory' in answer_text:
                gryffindor_indicators += 1
                slytherin_indicators += 1  # Also appeals to Slytherin ambition
            elif 'Wisdom' in answer_text:
                ravenclaw_indicators += 2
            elif 'Love' in answer_text:
                hufflepuff_indicators += 2
                
        if 'Q10' in self.answer_history:
            # "After death, what would you like people to do?"
            answer_text = self.answer_history['Q10']['answer_text']
            if 'Think with admiration of your achievements' in answer_text:
                slytherin_indicators += 2  # Achievement-focused legacy
                ravenclaw_indicators += 1
            elif "don't care what people think" in answer_text:
                slytherin_indicators += 1  # Self-focused approach
                ravenclaw_indicators += 1
            elif 'Miss you, but smile' in answer_text:
                hufflepuff_indicators += 2
            elif 'Ask for more stories' in answer_text:
                gryffindor_indicators += 2
                
        if 'Q11' in self.answer_history:
            # "Locked chest - which key?"
            answer_text = self.answer_history['Q11']['answer_text']
            if 'golden, ornate key' in answer_text and 'riches' in answer_text:
                slytherin_indicators += 2  # Attracted to wealth/status
            elif 'silver, intricate key' in answer_text and 'secret' in answer_text:
                slytherin_indicators += 1  # Secrets and mystery
                ravenclaw_indicators += 1
            elif 'simple, tarnished key' in answer_text:
                hufflepuff_indicators += 1
            elif 'heavy iron key' in answer_text and 'challenge' in answer_text:
                gryffindor_indicators += 1
                
        if 'Q12' in self.answer_history:
            # "Classmate with magical illness - dangerous plant cure"
            answer_text = self.answer_history['Q12']['answer_text']
            if 'Go into the forest yourself' in answer_text:
                gryffindor_indicators += 2
            elif 'Organize a group' in answer_text:
                hufflepuff_indicators += 2
                gryffindor_indicators += 1
            elif 'Research the plant' in answer_text:
                ravenclaw_indicators += 2
            elif 'clever means' in answer_text or 'trading' in answer_text or 'distraction' in answer_text:
                slytherin_indicators += 2  # Cunning and resourceful approach
                
        if 'Q13' in self.answer_history:
            # "Which quote resonates most?"
            answer_text = self.answer_history['Q13']['answer_text']
            if 'Fortune favors the bold' in answer_text:
                gryffindor_indicators += 1
                slytherin_indicators += 1  # Both houses can be bold
            elif 'ends justify the means' in answer_text:
                slytherin_indicators += 3  # Classic Slytherin philosophy
            elif 'Do what is right' in answer_text:
                gryffindor_indicators += 2
                hufflepuff_indicators += 1
            elif 'kindness goes a long way' in answer_text:
                hufflepuff_indicators += 2
                
        if 'Q14' in self.answer_history:
            # "What kind of power would you rather have?"
            answer_text = self.answer_history['Q14']['answer_text']
            if 'read minds' in answer_text:
                slytherin_indicators += 2  # Knowledge is power
                ravenclaw_indicators += 1
            elif 'invisibility' in answer_text:
                slytherin_indicators += 1  # Stealth and cunning
                gryffindor_indicators += 1
            elif 'change the past' in answer_text:
                slytherin_indicators += 2  # Ultimate power/control
            elif 'speak to animals' in answer_text:
                hufflepuff_indicators += 2
                
        if 'Q15' in self.answer_history:
            # "Hatstall tie-breaker - which house?"
            answer_text = self.answer_history['Q15']['answer_text']
            if 'Gryffindor' in answer_text:
                gryffindor_indicators += 3  # Direct preference
            elif 'Hufflepuff' in answer_text:
                hufflepuff_indicators += 3
            elif 'Ravenclaw' in answer_text:
                ravenclaw_indicators += 3
            elif 'Slytherin' in answer_text:
                slytherin_indicators += 3
        
        # Apply significant bonuses for strong patterns
        if gryffindor_indicators >= 3:
            trait_scores['bravery_score'] = min(10, trait_scores['bravery_score'] + 3)
            # Also boost related traits that support Gryffindor
            trait_scores['loyalty_score'] = min(10, trait_scores['loyalty_score'] + 1)
            
        if hufflepuff_indicators >= 3:
            trait_scores['loyalty_score'] = min(10, trait_scores['loyalty_score'] + 3)
            
        if ravenclaw_indicators >= 3:
            trait_scores['wisdom_score'] = min(10, trait_scores['wisdom_score'] + 3)
            
        if slytherin_indicators >= 3:
            trait_scores['ambition_score'] = min(10, trait_scores['ambition_score'] + 3)
            # Slytherins are also cunning (wisdom) and strategic (some bravery)
            trait_scores['wisdom_score'] = min(10, trait_scores['wisdom_score'] + 1)
            
        # Additional Slytherin boost for strong ambition patterns
        if slytherin_indicators >= 5:
            trait_scores['ambition_score'] = min(10, trait_scores['ambition_score'] + 2)
            
        # Ensure minimum differentiation between houses
        scores_list = [trait_scores['bravery_score'], trait_scores['loyalty_score'], 
                      trait_scores['wisdom_score'], trait_scores['ambition_score']]
        max_score = max(scores_list)
        min_score = min(scores_list)
        
        # If scores are too close, boost the leading house based on patterns
        if max_score - min_score < 2:
            if slytherin_indicators > max(gryffindor_indicators, hufflepuff_indicators, ravenclaw_indicators):
                trait_scores['ambition_score'] = min(10, trait_scores['ambition_score'] + 3)
            elif gryffindor_indicators > max(hufflepuff_indicators, ravenclaw_indicators, slytherin_indicators):
                trait_scores['bravery_score'] = min(10, trait_scores['bravery_score'] + 2)
            elif hufflepuff_indicators > max(gryffindor_indicators, ravenclaw_indicators, slytherin_indicators):
                trait_scores['loyalty_score'] = min(10, trait_scores['loyalty_score'] + 2)
            elif ravenclaw_indicators > max(gryffindor_indicators, hufflepuff_indicators, slytherin_indicators):
                trait_scores['wisdom_score'] = min(10, trait_scores['wisdom_score'] + 2)
            
        return trait_scores
    
    def predict_house(self):
        """Predict the house based on current answers"""
        trait_scores = self.calculate_trait_scores()
        if not trait_scores:
            return None, None
        
        # Debug logging to see scoring breakdown
        logger.info(f"=== SORTING HAT DEBUG ===")
        logger.info(f"Questions answered: {len(self.asked_questions)}")
        logger.info(f"Raw house scores: {self.user_scores}")
        logger.info(f"Final trait scores: {trait_scores}")
        
        # Log house indicators from pattern analysis
        weighted_scores = self.apply_question_weights()
        logger.info(f"Weighted scores: {weighted_scores}")
        
        # Log recent answers for debugging
        for q_id, answer_data in list(self.answer_history.items())[-5:]:
            logger.info(f"Q{q_id}: '{answer_data['answer_text'][:60]}...' -> {answer_data['scores']}")
        
        logger.info(f"=== PATTERN ANALYSIS ===")
        # Re-run pattern analysis for logging
        gryffindor_count = hufflepuff_count = ravenclaw_count = slytherin_count = 0
        
        # Quick pattern count for logging
        for q_id, answer_data in self.answer_history.items():
            answer_text = answer_data['answer_text']
            if q_id == 'Q01' and 'Cowardly' in answer_text:
                gryffindor_count += 2
            elif q_id == 'Q01' and 'Ordinary' in answer_text:
                slytherin_count += 2
            elif q_id == 'Q09' and 'Power' in answer_text:
                slytherin_count += 3
            elif q_id == 'Q13' and 'ends justify the means' in answer_text:
                slytherin_count += 3
                
        logger.info(f"Pattern indicators - Gryffindor: {gryffindor_count}, Hufflepuff: {hufflepuff_count}, Ravenclaw: {ravenclaw_count}, Slytherin: {slytherin_count}")
        logger.info(f"========================")
        
        # COMPETITIVE HOUSE SCORING - Direct competition between trait scores
        # Convert trait scores to house probabilities with strong differentiation
        house_scores = {
            'Gryffindor': trait_scores['bravery_score'],
            'Hufflepuff': trait_scores['loyalty_score'], 
            'Ravenclaw': trait_scores['wisdom_score'],
            'Slytherin': trait_scores['ambition_score']
        }
        
        # Apply exponential scaling to increase differentiation
        for house in house_scores:
            house_scores[house] = house_scores[house] ** 2  # Square to amplify differences
        
        # Add weighted question bonuses directly to house scores
        weighted_house_scores = self.apply_question_weights()
        for house in house_scores:
            house_scores[house] += weighted_house_scores[house] * 0.5  # Additional weight bonus
        
        # Ensure Slytherin gets proper recognition with pattern boost
        if slytherin_count >= 3:
            house_scores['Slytherin'] *= 1.8  # Strong boost for Slytherin patterns
            logger.info(f"Applied Slytherin pattern boost - indicators: {slytherin_count}")
        
        # Apply Gryffindor pattern boost
        if gryffindor_count >= 3:
            house_scores['Gryffindor'] *= 1.6
            logger.info(f"Applied Gryffindor pattern boost - indicators: {gryffindor_count}")
        
        # Calculate probabilities from enhanced house scores
        total_score = sum(house_scores.values())
        if total_score == 0:
            total_score = 1
            
        house_confidences = {house: score/total_score for house, score in house_scores.items()}
        prediction = max(house_confidences, key=house_confidences.get)
        
        logger.info(f"Enhanced house scores: {house_scores}")
        logger.info(f"Final confidences: {house_confidences}")
        logger.info(f"Final prediction: {prediction}")
        
        # Fall back to ML model if needed (for comparison)
        if isinstance(sorting_hat_model, dict) and 'model' in sorting_hat_model:
            model = sorting_hat_model['model']
            model_type = sorting_hat_model.get('model_type', 'basic')
            
            if model_type == 'Enhanced_RandomForest' or 'enhanced' in str(type(model)).lower():
                # Enhanced model with interaction features
                full_features = create_interaction_features_dict(trait_scores)
                feature_columns = sorting_hat_model.get('feature_columns', list(full_features.keys()))
                features = np.array([[full_features[col] for col in feature_columns]])
                
                # Use scaler if available
                if 'scaler' in sorting_hat_model and sorting_hat_model['scaler'] is not None:
                    features = sorting_hat_model['scaler'].transform(features)
                
                ml_prediction = model.predict(features)[0]
                ml_probabilities = model.predict_proba(features)[0]
                ml_house_confidences = dict(zip(model.classes_, ml_probabilities))
                logger.info(f"ML model would predict: {ml_prediction} with confidences: {ml_house_confidences}")
        
        # Use our enhanced scoring system instead of ML model
        # This gives us direct control over Slytherin recognition
        
        logger.info(f"Model prediction: {prediction} with confidences: {house_confidences}")
        logger.info(f"========================")
        
        return prediction, house_confidences
    
    def should_continue_asking(self):
        """Determine if we should continue asking questions - use all 15 questions for maximum accuracy"""
        # Continue until all questions are asked for the most accurate sorting
        return len(self.asked_questions) < len(self.questions)

# Load Sorting Hat resources on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    load_sorting_hat_resources()
    yield
    # Shutdown
    pass

app = FastAPI(
    title="Wiz-Scholar AI API",
    description="AI backend for the Wiz-Scholar application with Enhanced Sorting Hat ML model",
    version="2.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class HealthResponse(BaseModel):
    status: str
    message: str
    ai_status: str

class QueryRequest(BaseModel):
    query: str
    context: str = ""

class QueryResponse(BaseModel):
    response: str
    confidence: float
    model_used: str

# Sorting Hat models
class SortingHatQuestion(BaseModel):
    id: str
    text: str
    options: List[Dict]

class SortingHatAnswer(BaseModel):
    question_id: str
    answer_index: int
    session_id: str = "default"

class SortingHatPrediction(BaseModel):
    house: str
    confidence: float
    all_confidences: Dict[str, float]
    trait_scores: Dict[str, int]

class SortingHatGameState(BaseModel):
    current_question: Optional[SortingHatQuestion]
    prediction: Optional[SortingHatPrediction]
    should_continue: bool
    questions_asked: int
    game_complete: bool

class TraitScoresRequest(BaseModel):
    bravery_score: int
    wisdom_score: int
    ambition_score: int
    loyalty_score: int

# Global game sessions (in production, use Redis or database)
game_sessions: Dict[str, SortingHatAkinator] = {}

@app.get("/", response_model=dict)
async def root():
    return {
        "message": "Wiz-Scholar AI Server with Enhanced Sorting Hat is running!",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    try:
        ai_status = "ready"
        if not os.getenv("OPENAI_API_KEY"):
            ai_status = "no_api_key"
        
        return HealthResponse(
            status="healthy",
            message="AI server is running with Enhanced Sorting Hat",
            ai_status=ai_status
        )
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail="Health check failed")

@app.post("/api/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    try:
        response = f"AI processed your query: '{request.query}'"
        
        return QueryResponse(
            response=response,
            confidence=0.95,
            model_used="placeholder-model"
        )
    except Exception as e:
        logger.error(f"Query processing failed: {e}")
        raise HTTPException(status_code=500, detail="Query processing failed")

@app.get("/api/models")
async def list_models():
    model_status = "available" if sorting_hat_model else "unavailable"
    model_type = "Enhanced" if isinstance(sorting_hat_model, dict) and sorting_hat_model.get('model_type') == 'Enhanced_RandomForest' else "Basic"
    
    return {
        "models": [
            {"id": "placeholder", "name": "Placeholder Model", "status": "available"},
            {"id": "sorting-hat", "name": f"{model_type} Sorting Hat ML Model", "status": model_status}
        ]
    }

# Sorting Hat session model
class SortingHatSessionRequest(BaseModel):
    session_id: str = "default"

# Sorting Hat Endpoints
@app.post("/api/sorting-hat/start")
async def start_sorting_hat_session(request: SortingHatSessionRequest = SortingHatSessionRequest()):
    """Start a new Sorting Hat session"""
    if not sorting_hat_model or not sorting_hat_questions:
        raise HTTPException(status_code=503, detail="Sorting Hat model not available")
    
    akinator = SortingHatAkinator(sorting_hat_questions, sorting_hat_model)
    game_sessions[request.session_id] = akinator
    
    first_question = akinator.get_next_question()
    
    return SortingHatGameState(
        current_question=SortingHatQuestion(**first_question) if first_question else None,
        prediction=None,
        should_continue=True,
        questions_asked=0,
        game_complete=False
    )

@app.post("/api/sorting-hat/answer")
async def answer_sorting_hat_question(answer: SortingHatAnswer):
    """Answer a Sorting Hat question"""
    if answer.session_id not in game_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    akinator = game_sessions[answer.session_id]
    
    # Process the answer
    success = akinator.answer_question(answer.question_id, answer.answer_index)
    if not success:
        raise HTTPException(status_code=400, detail="Invalid answer")
    
    # Get prediction
    predicted_house, confidences = akinator.predict_house()
    trait_scores = akinator.calculate_trait_scores()
    
    prediction = None
    if predicted_house and confidences and trait_scores:
        prediction = SortingHatPrediction(
            house=predicted_house,
            confidence=max(confidences.values()),
            all_confidences=confidences,
            trait_scores=trait_scores
        )
    
    # Check if we should continue
    should_continue = akinator.should_continue_asking()
    next_question = None
    
    if should_continue:
        next_question = akinator.get_next_question()
    
    game_complete = not should_continue or next_question is None
    
    return SortingHatGameState(
        current_question=SortingHatQuestion(**next_question) if next_question else None,
        prediction=prediction,
        should_continue=should_continue and next_question is not None,
        questions_asked=len(akinator.asked_questions),
        game_complete=game_complete
    )

@app.post("/api/sorting-hat/predict-direct")
async def predict_house_direct(scores: TraitScoresRequest):
    """Predict house directly from trait scores"""
    if not sorting_hat_model:
        raise HTTPException(status_code=503, detail="Sorting Hat model not available")
    
    try:
        trait_scores = {
            'bravery_score': scores.bravery_score,
            'wisdom_score': scores.wisdom_score,
            'ambition_score': scores.ambition_score,
            'loyalty_score': scores.loyalty_score
        }
        
        # Handle enhanced vs basic model
        if isinstance(sorting_hat_model, dict) and 'model' in sorting_hat_model:
            model = sorting_hat_model['model']
            model_type = sorting_hat_model.get('model_type', 'basic')
            
            if model_type == 'Enhanced_RandomForest' or 'enhanced' in str(type(model)).lower():
                # Enhanced model
                full_features = create_interaction_features_dict(trait_scores)
                feature_columns = sorting_hat_model.get('feature_columns', list(full_features.keys()))
                features = np.array([[full_features[col] for col in feature_columns]])
                
                if 'scaler' in sorting_hat_model and sorting_hat_model['scaler'] is not None:
                    features = sorting_hat_model['scaler'].transform(features)
                
                prediction = model.predict(features)[0]
                probabilities = model.predict_proba(features)[0]
                house_confidences = dict(zip(model.classes_, probabilities))
            else:
                # Basic model
                features = np.array([[trait_scores['bravery_score'], trait_scores['wisdom_score'], 
                                    trait_scores['ambition_score'], trait_scores['loyalty_score']]])
                prediction = model.predict(features)[0]
                probabilities = model.predict_proba(features)[0]
                house_confidences = dict(zip(model.classes_, probabilities))
        else:
            # Legacy model
            features = np.array([[trait_scores['bravery_score'], trait_scores['wisdom_score'], 
                                trait_scores['ambition_score'], trait_scores['loyalty_score']]])
            if isinstance(sorting_hat_model, dict) and 'model' in sorting_hat_model:
                model = sorting_hat_model['model']
                prediction = model.predict(features)[0]
                probabilities = model.predict_proba(features)[0]
                house_confidences = dict(zip(model.classes_, probabilities))
            else:
                prediction = sorting_hat_model.predict(features)[0]
                probabilities = sorting_hat_model.predict_proba(features)[0]
                house_confidences = dict(zip(sorting_hat_model.classes_, probabilities))
        
        return SortingHatPrediction(
            house=prediction,
            confidence=max(house_confidences.values()),
            all_confidences=house_confidences,
            trait_scores=trait_scores
        )
    except Exception as e:
        logger.error(f"Direct prediction failed: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed")

@app.get("/api/sorting-hat/questions")
async def get_all_questions():
    """Get all available Sorting Hat questions"""
    if not sorting_hat_questions:
        raise HTTPException(status_code=503, detail="Questions not available")
    
    return {"questions": sorting_hat_questions}

@app.delete("/api/sorting-hat/session/{session_id}")
async def end_sorting_hat_session(session_id: str):
    """End a Sorting Hat session"""
    if session_id in game_sessions:
        del game_sessions[session_id]
        return {"message": "Session ended successfully"}
    else:
        raise HTTPException(status_code=404, detail="Session not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
