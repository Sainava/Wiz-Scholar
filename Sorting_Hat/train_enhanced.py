#!/usr/bin/env python3
"""
Enhanced Sorting Hat Model Training Script
Incorporates detailed house characteristics and all questions from Question_Bank.csv
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import json
import random
from sklearn.preprocessing import StandardScaler

def generate_enhanced_training_data(n_samples=2000):
    """Generate enhanced synthetic data based on detailed house characteristics"""
    
    # Enhanced house trait profiles based on the PDF characteristics
    house_profiles = {
        'Gryffindor': {
            'bravery_score': (7, 10),      # High bravery (primary trait)
            'wisdom_score': (4, 8),        # Moderate wisdom
            'ambition_score': (5, 9),      # Can be quite ambitious
            'loyalty_score': (6, 9),       # High loyalty to friends/ideals
            'leadership': (6, 10),         # Natural leaders
            'impulsiveness': (6, 9),       # Tend to be impulsive
            'justice_oriented': (7, 10),   # Strong sense of justice
            'risk_taking': (7, 10),        # High risk tolerance
            'honor_focused': (7, 10),      # Value honor highly
        },
        'Hufflepuff': {
            'bravery_score': (4, 7),       # Quiet courage
            'wisdom_score': (5, 8),        # Practical wisdom
            'ambition_score': (3, 6),      # Less focused on personal glory
            'loyalty_score': (8, 10),      # Highest loyalty (primary trait)
            'leadership': (3, 7),          # Less likely to seek leadership
            'impulsiveness': (2, 5),       # More thoughtful/patient
            'justice_oriented': (6, 9),    # Strong sense of fairness
            'risk_taking': (3, 6),         # More cautious
            'honor_focused': (6, 9),       # Value integrity
        },
        'Ravenclaw': {
            'bravery_score': (3, 7),       # Intellectual courage
            'wisdom_score': (8, 10),       # Highest wisdom (primary trait)
            'ambition_score': (6, 9),      # Ambitious for knowledge/achievement
            'loyalty_score': (5, 8),       # Loyal to ideals/knowledge
            'leadership': (4, 8),          # Can lead through expertise
            'impulsiveness': (2, 5),       # Think before acting
            'justice_oriented': (5, 8),    # Logical approach to justice
            'risk_taking': (4, 7),         # Calculated risks
            'honor_focused': (5, 8),       # Value truth and knowledge
        },
        'Slytherin': {
            'bravery_score': (5, 8),       # Calculated bravery
            'wisdom_score': (6, 9),        # Cunning intelligence
            'ambition_score': (8, 10),     # Highest ambition (primary trait)
            'loyalty_score': (4, 7),       # Selective loyalty
            'leadership': (7, 10),         # Natural leaders
            'impulsiveness': (3, 6),       # More calculating
            'justice_oriented': (3, 7),    # Flexible moral code
            'risk_taking': (5, 8),         # Strategic risk-taking
            'honor_focused': (4, 7),       # Pragmatic about honor
        }
    }
    
    data = []
    houses = list(house_profiles.keys())
    
    # Set random seed for reproducibility
    np.random.seed(42)
    random.seed(42)
    
    for _ in range(n_samples):
        # Randomly select a house
        house = random.choice(houses)
        profile = house_profiles[house]
        
        # Generate scores based on house profile
        sample = {'house': house}
        
        for trait, (min_val, max_val) in profile.items():
            if trait == 'house':
                continue
            base_score = np.random.randint(min_val, max_val + 1)
            
            # Add some noise and cross-house variance (15% chance)
            if random.random() < 0.15:
                noise = random.randint(-2, 2)
                base_score = max(1, min(10, base_score + noise))
            
            sample[trait] = str(base_score)
        
        data.append(sample)
    
    return pd.DataFrame(data)

def create_interaction_features(df):
    """Create interaction features to capture complex relationships"""
    
    # Create derived features
    df['bravery_loyalty_ratio'] = df['bravery_score'] / (df['loyalty_score'] + 0.1)
    df['wisdom_ambition_ratio'] = df['wisdom_score'] / (df['ambition_score'] + 0.1)
    df['leadership_potential'] = (df['leadership'] + df['bravery_score'] + df['ambition_score']) / 3
    df['moral_flexibility'] = 10 - df['justice_oriented']  # Inverse of justice orientation
    df['calculated_thinking'] = (df['wisdom_score'] + (10 - df['impulsiveness'])) / 2
    df['courage_type'] = df['bravery_score'] * df['risk_taking'] / 10  # Physical vs intellectual courage
    
    # House-specific composite scores
    df['gryffindor_composite'] = (df['bravery_score'] * 0.3 + df['honor_focused'] * 0.25 + 
                                 df['justice_oriented'] * 0.25 + df['loyalty_score'] * 0.2)
    df['hufflepuff_composite'] = (df['loyalty_score'] * 0.4 + df['justice_oriented'] * 0.25 + 
                                 df['honor_focused'] * 0.2 + (10 - df['ambition_score']) * 0.15)
    df['ravenclaw_composite'] = (df['wisdom_score'] * 0.35 + df['calculated_thinking'] * 0.25 + 
                                df['ambition_score'] * 0.2 + df['leadership'] * 0.2)
    df['slytherin_composite'] = (df['ambition_score'] * 0.35 + df['leadership'] * 0.25 + 
                                df['wisdom_score'] * 0.2 + df['moral_flexibility'] * 0.2)
    
    return df

def process_question_bank(df):
    """Process the question bank to create a structured format"""
    questions = []
    current_question = None
    
    for _, row in df.iterrows():
        if pd.notna(row['Question ID']):
            # New question
            if current_question:
                questions.append(current_question)
            current_question = {
                'id': row['Question ID'],
                'text': row['Question Text'],
                'options': []
            }
        
        if pd.notna(row['Answer Option']) and current_question:
            # Add option to current question
            option = {
                'text': row['Answer Option'],
                'scores': {
                    'Gryffindor': int(row['Gryffindor']),
                    'Hufflepuff': int(row['Hufflepuff']),
                    'Ravenclaw': int(row['Ravenclaw']),
                    'Slytherin': int(row['Slytherin'])
                }
            }
            current_question['options'].append(option)
    
    if current_question:
        questions.append(current_question)
    
    return questions

def main():
    print("Starting Enhanced Sorting Hat Model Training...")
    
    # Generate enhanced training data
    print("Generating enhanced synthetic training data...")
    training_data = generate_enhanced_training_data(2000)
    
    print(f"Generated {len(training_data)} training samples")
    print("Features:", training_data.columns.tolist())
    print("House distribution:")
    print(training_data['house'].value_counts())
    
    # Create interaction features
    print("Creating interaction features...")
    training_data = create_interaction_features(training_data)
    
    # Save enhanced training data
    training_data.to_csv('enhanced_sorting_hat_data.csv', index=False)
    print("Enhanced training data saved to 'enhanced_sorting_hat_data.csv'")
    
    # Prepare features and target
    feature_columns = [col for col in training_data.columns if col != 'house']
    X = training_data[feature_columns]
    y = training_data['house']
    
    print(f"Using {len(feature_columns)} features for training")
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print(f"Training set size: {len(X_train)}")
    print(f"Test set size: {len(X_test)}")
    
    # Scale features for better performance
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train multiple models and compare
    models = {
        'DecisionTree': DecisionTreeClassifier(
            random_state=42,
            max_depth=15,
            min_samples_split=10,
            min_samples_leaf=5,
            class_weight='balanced'
        ),
        'RandomForest': RandomForestClassifier(
            n_estimators=100,
            random_state=42,
            max_depth=12,
            min_samples_split=10,
            min_samples_leaf=5,
            class_weight='balanced'
        )
    }
    
    best_model = None
    best_accuracy = 0
    best_model_name = ""
    
    for name, model in models.items():
        print(f"\nTraining {name}...")
        
        if name == 'RandomForest':
            model.fit(X_train_scaled, y_train)
            y_pred = model.predict(X_test_scaled)
        else:
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)
        
        accuracy = accuracy_score(y_test, y_pred)
        print(f"{name} Accuracy: {accuracy:.4f}")
        
        if accuracy > best_accuracy:
            best_accuracy = accuracy
            best_model = model
            best_model_name = name
    
    print(f"\nBest model: {best_model_name} with accuracy: {best_accuracy:.4f}")
    
    # Final evaluation with best model
    if best_model is not None:
        if best_model_name == 'RandomForest':
            y_pred_final = best_model.predict(X_test_scaled)
        else:
            y_pred_final = best_model.predict(X_test)
        
        print("\nFinal Classification Report:")
        print(classification_report(y_test, y_pred_final))
    else:
        print("\nNo model was successfully trained. Please check your data and model configuration.")
    
    # Feature importance for interpretability
    if best_model is not None and hasattr(best_model, 'feature_importances_'):
        feature_importance = pd.DataFrame({
            'feature': feature_columns,
            'importance': best_model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\nTop 10 Most Important Features:")
        print(feature_importance.head(10))
    
    # Save the best model and scaler
    model_data = {
        'model': best_model,
        'scaler': scaler if best_model_name == 'RandomForest' else None,
        'feature_columns': feature_columns,
        'model_type': best_model_name
    }
    
    joblib.dump(model_data, 'enhanced_sorting_hat_model.joblib')
    print(f"Enhanced model saved as 'enhanced_sorting_hat_model.joblib'")
    
    # Process and save questions
    try:
        question_bank = pd.read_csv('Question_Bank.csv')
        structured_questions = process_question_bank(question_bank)
        
        with open('structured_questions.json', 'w') as f:
            json.dump(structured_questions, f, indent=2)
        print(f"Questions saved as 'structured_questions.json' ({len(structured_questions)} questions)")
        
    except FileNotFoundError:
        print("Question_Bank.csv not found. Skipping question processing.")
    
    print("Enhanced training complete!")

if __name__ == "__main__":
    main()
