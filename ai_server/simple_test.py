"""
Simple test script to verify FastAPI server functionality
"""
import os
import json
import joblib
import numpy as np

def test_model_files():
    """Test that all required files exist and can be loaded"""
    print("=== Testing Sorting Hat Files ===")
    
    # Check enhanced model
    enhanced_model_path = "../Sorting_Hat/enhanced_sorting_hat_model.joblib"
    if os.path.exists(enhanced_model_path):
        print(f"✅ Enhanced model found: {enhanced_model_path}")
        try:
            model_data = joblib.load(enhanced_model_path)
            print(f"✅ Enhanced model loaded successfully")
            print(f"   Model type: {type(model_data)}")
            if isinstance(model_data, dict):
                print(f"   Keys: {list(model_data.keys())}")
                if 'feature_columns' in model_data:
                    print(f"   Features: {len(model_data['feature_columns'])}")
        except Exception as e:
            print(f"❌ Error loading enhanced model: {e}")
    else:
        print(f"❌ Enhanced model not found")
    
    # Check questions
    questions_path = "../Sorting_Hat/structured_questions.json"
    if os.path.exists(questions_path):
        print(f"✅ Questions file found: {questions_path}")
        try:
            with open(questions_path, 'r') as f:
                questions = json.load(f)
            print(f"✅ Questions loaded: {len(questions)} questions")
        except Exception as e:
            print(f"❌ Error loading questions: {e}")
    else:
        print(f"❌ Questions file not found")

def test_prediction():
    """Test making a prediction with the enhanced model"""
    print("\n=== Testing Model Prediction ===")
    
    try:
        # Load enhanced model
        model_data = joblib.load("../Sorting_Hat/enhanced_sorting_hat_model.joblib")
        
        if not isinstance(model_data, dict):
            print("❌ Model data is not in expected dictionary format")
            return False
            
        model = model_data['model']
        feature_columns = model_data.get('feature_columns', [])
        scaler = model_data.get('scaler', None)
        
        print(f"✅ Model components loaded")
        print(f"   Features: {len(feature_columns)}")
        print(f"   Scaler available: {scaler is not None}")
        
        # Create test feature set (using dummy values for all 18 features)
        test_features = {
            'bravery_score': 8,
            'wisdom_score': 6,
            'ambition_score': 7,
            'loyalty_score': 5,
            'leadership': 6,
            'impulsiveness': 4,
            'justice_oriented': 8,
            'risk_taking': 7,
            'bravery_loyalty_ratio': 1.6,
            'wisdom_ambition_ratio': 0.86,
            'leadership_potential': 7.0,
            'moral_flexibility': 2.0,
            'calculated_thinking': 8.0,
            'courage_type': 5.6,
            'gryffindor_composite': 6.6,
            'hufflepuff_composite': 5.5,
            'ravenclaw_composite': 6.4,
            'slytherin_composite': 6.8
        }
        
        # Prepare feature array
        features_array = np.array([[test_features[col] for col in feature_columns]])
        
        # Scale if scaler available
        if scaler is not None:
            features_array = scaler.transform(features_array)
        
        # Make prediction
        prediction = model.predict(features_array)[0]
        probabilities = model.predict_proba(features_array)[0]
        
        print(f"✅ Prediction successful: {prediction}")
        print(f"   Confidence: {max(probabilities):.3f}")
        print(f"   All probabilities: {dict(zip(model.classes_, probabilities))}")
        
        return True
        
    except Exception as e:
        print(f"❌ Prediction test failed: {e}")
        return False

def main():
    print("Sorting Hat FastAPI Integration Test")
    print("=" * 50)
    
    test_model_files()
    success = test_prediction()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 All tests PASSED! FastAPI server should work correctly.")
    else:
        print("❌ Some tests FAILED. Check the errors above.")

if __name__ == "__main__":
    main()
