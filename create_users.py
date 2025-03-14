import csv
from django.db import transaction
from django.contrib.auth.models import User

# File path - update this to the location of your CSV file
csv_path = "users.csv"

# Function to load users from CSV
def create_users_from_csv(csv_path):
    """
    Load users from a CSV file and create User models
    
    Args:
        csv_path: Path to the CSV file
    """
    # Read the CSV file
    print(f"Reading users from {csv_path}...")
    
    with open(csv_path, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        users_data = []
        
        # Process each row in the CSV
        for i, row in enumerate(reader, 1):
            try:
                # Extract data from the row - update column names if needed
                first_name = row.get('First name').strip()
                last_name = row.get('Last name').strip()
                phone_number = row.get('Phone number').strip()
                
                # Create username in FirstnameLastname format
                username = f"{first_name}{last_name}"
                
                # Add user data
                users_data.append({
                    'username': username,
                    'password': phone_number,
                    'first_name': first_name,
                    'last_name': last_name
                })
                
                print(f"Processed user {i}: {username}")
                
            except (KeyError, ValueError) as e:
                print(f"Error processing row {i}: {e}")
                continue
    
    # Create users in a single transaction
    created_count = 0
    skipped_count = 0
    
    try:
        with transaction.atomic():
            # Create new users
            for data in users_data:
                username = data['username']
                
                # Check if user already exists
                if User.objects.filter(username=username).exists():
                    print(f"User '{username}' already exists. Skipping.")
                    skipped_count += 1
                    continue
                
                # Create the user
                password = data.pop('password')
                user = User.objects.create_user(
                    password=password,
                    **data
                )
                created_count += 1
                print(f"Created user: {username}")
            
            print(f"\nSummary: Created {created_count} users, skipped {skipped_count} existing users")
            
    except Exception as e:
        print(f"Error creating users: {e}")

# Execute the function
create_users_from_csv(csv_path)
print("Done!")
