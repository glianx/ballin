"""
runs in python 3.11 kernal
takes the json file for a given project, and recommend the top 10 users that matches the skills
required through word embedding.

Match factor is calculated as:
P: project technology set
U: User skill set

\sum_{P} \min_{U}{||p_i - u_j||}
"""

import json
import spacy
import numpy as np

def load_json(filepath):
    """Load and return JSON data from a file."""
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

def embed_text(nlp, text):
    """
    Get the vector for the given text using the provided spaCy model.
    Note: For multi-word phrases, spaCy returns an averaged vector.
    """
    doc = nlp(text)
    return doc.vector

def euclidean_distance(vec1, vec2):
    """Calculate the Euclidean distance between two vectors."""
    return np.linalg.norm(vec1 - vec2)

def main():
    # json input files
    users_file = "/Users/jz/Downloads/users.json"
    project_file = "/Users/jz/Downloads/project.json"

    # Load JSON data
    users_data = load_json(users_file)
    project_data = load_json(project_file)

    # Load spaCy's medium English model for word embeddings
    nlp = spacy.load("en_core_web_md")

    # Extract the project technologies and compute their embeddings
    project_techs = project_data.get("technologies", [])
    project_vectors = {tech: embed_text(nlp, tech) for tech in project_techs}

    # Create a list to store each user's computed distance to the project
    user_distances = []

    # Loop through every user in the JSON data
    for user_id, details in users_data.items():
        skills = details.get("skills", [])
        if not skills:
            # If the user has no skills, assign an infinite distance so they won't be recommended.
            total_distance = float("inf")
        else:
            # Compute embeddings for each user skill
            skill_vectors = [embed_text(nlp, skill) for skill in skills]

            # For every technology required by the project, find the user's closest skill.
            total_distance = 0.0
            for tech, tech_vector in project_vectors.items():
                # Calculate the distance between this technology and each of the user's skills.
                distances = [euclidean_distance(tech_vector, skill_vector) for skill_vector in skill_vectors]
                # Add the minimum distance for this technology to the total distance.
                total_distance += min(distances)

        # Save the computed distance along with the user ID.
        user_distances.append({"user_id": user_id, "distance": total_distance})

    # Sort users by the computed distance (lower distance indicates a better match)
    user_distances.sort(key=lambda x: x["distance"])

    # Select the top 10 users (or fewer if there aren't enough users)
    top_users = user_distances[:10]
    top_user_ids = [user["user_id"] for user in top_users]

    # Output the top user IDs as a comma-separated string
    print(",".join(top_user_ids))

if __name__ == "__main__":
    main()
