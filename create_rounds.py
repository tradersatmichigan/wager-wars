import csv
from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from core.models import Game, Round, RoundStatusEnum

# File path - update this to the location of your CSV file
csv_path = "day1.csv"

# Function to load rounds from CSV
def load_rounds_from_csv(csv_path, game_id=None):
    """
    Load rounds from a CSV file and create Round models
    
    Args:
        csv_path: Path to the CSV file
        game_id: ID of the game to associate rounds with. If None, uses the first active game.
    """
    # Get or create a game to associate rounds with
    try:
        if game_id:
            game = Game.objects.get(id=game_id)
        else:
            game = Game.objects.filter(is_active=True).first()
            if not game:
                game = Game.objects.create(name="Wager Wars Day 1", is_active=True)
                print(f"Created new game: {game.name} (ID: {game.id})")
            else:
                print(f"Using existing game: {game.name} (ID: {game.id})")
    except ObjectDoesNotExist:
        print(f"Game with ID {game_id} not found. Please provide a valid game ID.")
        return
    
    # Read the CSV file
    print(f"Reading rounds from {csv_path}...")
    
    with open(csv_path, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        rounds_data = []
        
        # Process each row in the CSV
        for i, row in enumerate(reader, 1):
            try:
                # Extract data from the row
                question = row.get('Question')
                payout_odds = float(row.get('Payout Odds', 1.0))
                probability = float(row.get('True Probability', 0.5))
                
                # Calculate multiplier from payout odds
                multiplier = payout_odds
                
                # Add round data
                rounds_data.append({
                    'number': i,
                    'question': question,
                    'probability': probability,
                    'multiplier': multiplier,
                    'phase_duration': 30,  # Set phase duration to 30 seconds as requested
                    'status': RoundStatusEnum.PENDING
                })
                
                print(f"Processed round {i}: {question}")
                
            except (KeyError, ValueError) as e:
                print(f"Error processing row {i}: {e}")
                continue
    
    # Create rounds in a single transaction
    try:
        with transaction.atomic():
            # Delete existing rounds for this game if any
            existing_count = Round.objects.filter(game=game).count()
            if existing_count > 0:
                print(f"Deleting {existing_count} existing rounds for game '{game.name}'...")
                Round.objects.filter(game=game).delete()
            
            # Create new rounds
            created_rounds = []
            for data in rounds_data:
                round_obj = Round.objects.create(game=game, **data)
                created_rounds.append(round_obj)
            
            # Update the game's current round number
            game.current_round_number = 0
            game.save()
            
            print(f"Successfully created {len(created_rounds)} rounds for game '{game.name}'")
            
            # Display the created rounds
            print("\nCreated rounds:")
            for r in created_rounds:
                print(f"Round {r.number}: {r.question} (Prob: {r.probability}, Mult: {r.multiplier})")
            
    except Exception as e:
        print(f"Error creating rounds: {e}")

# Execute the function
game_id = None  # Set this to a specific game ID if needed
load_rounds_from_csv(csv_path, game_id)
print("Done!")
