#Recommender Class
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity



class AdvancedPlayerRecommender:
    def __init__(self, data):
        self.data = data
        print ("Available columns:", list(self.data.columns))
        self.scaler = StandardScaler()
        self.features = ['Gls', 'Ast', 'xG', 'xA', 'Tkl', 'Int', 'PrgC', 'PrgP', 'Sh', 'SoT', 'Clr', 'KP']
        self.position_categories = {
            'Defender': ['DF'],
            'Midfielder': ['MF'],
            'Forward': ['FW']
        }
        self.subcategories = {
            'Defender': ['CB', 'FB', 'WB'],
            'Midfielder': ['DM', 'CM', 'AM'],
            'Forward': ['ST', 'W', 'SS']
        }
        self.role_features = {
            'CB': ['Tkl', 'Int', 'Clr', ],
            'FB': ['Tkl', 'Int', 'PrgC', 'PrgP'],
            'WB': ['Tkl', 'Int', 'PrgC', 'PrgP'],
            'DM': ['Tkl', 'Int', 'PrgP', 'Pass'],
            'CM': ['Pass', 'PrgP', 'Ast', 'KP'],
            'AM': ['Ast', 'KP', 'xA', 'PrgP'],
            'ST': ['Gls', 'xG', 'Sh', 'SoT'],
            'W': ['Ast', 'xA', 'PrgC', 'Drib'],
            'SS': ['Gls', 'Ast', 'xG', 'xA']
        }
        print("Available columns:", list(self.data.columns))
        self.prepare_data()

    def prepare_data(self):
        self.data['MainPos'] = self.data['Pos'].apply(lambda x: x.split(',')[0])
        self.scaled_features = self.scaler.fit_transform(self.data[self.features])
        self.data['Subcategory'] = self.data.apply(self.infer_subcategory, axis=1)

    def infer_subcategory(self, row):
        pos = row['MainPos']
        if pos == 'DF':
            return 'CB' if row['Clr'] > row['PrgP'] else 'FB'
        elif pos == 'MF':
            if row['Tkl'] + row['Int'] > row['xA'] + row['Ast']:
                return 'DM'
            elif row['xA'] + row['Ast'] > row['Gls'] + row['xG']:
                return 'AM'
            return 'CM'
        elif pos == 'FW':
            if row['PrgC'] > 5:
                return 'W'
            elif row['Ast'] > row['Gls']:
                return 'SS'
            return 'ST'
        return 'Unknown'

    def get_recommendations(self, category, subcategory=None, num_recommendations=5, min_matches=10):
        if category not in self.position_categories:
            raise ValueError(f"Invalid category. Choose from {list(self.position_categories.keys())}")

        if subcategory and subcategory not in self.subcategories[category]:
            raise ValueError(f"Invalid subcategory for {category}. Choose from {self.subcategories[category]}")

        # Filter by category
        category_mask = self.data['MainPos'].isin(self.position_categories[category])
        filtered_data = self.data[category_mask]

        print(f"Players in {category} category: {len(filtered_data)}")

        # Filter by subcategory if specified
        if subcategory:
            filtered_data = filtered_data[filtered_data['Subcategory'] == subcategory]
            print(f"Players in {subcategory} subcategory: {len(filtered_data)}")

        # Filter players with minimum matches
        filtered_data = filtered_data[filtered_data['90s'] >= min_matches]

        # Check if we have enough players
        if len(filtered_data) < num_recommendations:
            print(f"Warning: Only {len(filtered_data)} players found for the specified criteria.")
            return filtered_data

        # Select relevant features for the role
        role_features = self.role_features.get(subcategory, self.features) if subcategory else self.features
        role_features = [f for f in role_features if f in self.features]  # Ensure all features are in the dataset
        print(f"Using features: {role_features}")

        # Normalize the features for the filtered data
        scaler = StandardScaler()
        normalized_data = scaler.fit_transform(filtered_data[role_features])

        # Calculate similarities using the normalized data
        similarities = cosine_similarity(normalized_data)

        # Get top similar players
        top_similar_indices = similarities.argsort()[:, ::-1][:, 1:num_recommendations+1].flatten()

        # Get the recommendations
        recommendations = filtered_data.iloc[top_similar_indices].copy()
        recommendations['Similarity'] = similarities[0, top_similar_indices]

        # Sort by similarity
        recommendations = recommendations.sort_values('Similarity', ascending=False)

        # Include all relevant features in the output
        all_features = list(set(self.features + role_features + ['Player', 'Pos', 'Club', 'Similarity']))
        
        
        if not recommendations.empty:
            print("Sample recommendation data:")
            print(recommendations.iloc[0].to_dict())


        return recommendations[all_features].head(num_recommendations)

