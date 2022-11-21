import csv
import json
from faker import Faker
from datetime import timedelta, date
import numpy as np
import pandas as pd

fake = Faker()
#Faker.seed(1)

def create_dod(inDate):
    # Using builtin support of timedelta, add 18 years (in days accounting for up to 4 leap years), and 100 years as a cap0
    age_min_offset = 6574
    age_max_offset = 36900
    dod_min  = inDate + timedelta(days=age_min_offset)
    dod_max = inDate + timedelta(days=age_max_offset)
    if(dod_max - date.today() > timedelta(0)):
        dod_max = date.today()
    dod_out = fake.date_between_dates(date_start=dod_min, date_end=dod_max)
    return dod_out

'''
def datagenerate(patients, headers):
    fake = Faker('en_US')
    with open("Synthetic_FHH_Data.csv", 'wt') as csvFile:
        writer = csv.DictWriter(csvFile, fieldnames=headers)
        writer.writeheader()

        for i in range(patients):
            sex = np.random.choice(["M", "F"], p=[0.5, 0.5])
            adopted = np.random.choice(["In", "Out", "No"], p=[0.0023, 0.0002, 0.9975])
            dob = fake.date_of_birth(minimum_age=18, maximum_age=100)
            deceased = np.random.choice(["Yes", "No"], p=[0.25, 0.75])

            #multiBirthtype = np.random.choice(["Fraternal", "Identical", "Triplets", " "], p=[0.03, 0.01, 0.005, 0.955])

            race = np.random.choice(["American Indian or Alaskan Native", "Asian", "Native Hawaiian or Other Pacific Islander", "Black or African American", "White", "Other"],
                p=[0.013, 0.061, 0.003, 0.136, 0.758, 0.029])

            writer.writerow({
                    "Patient ID": fake.uuid4(),#'01-001' if i==0 else fake.bothify('0#-0##'),     #ADD logic to specify the age for 01-001 for generation
                    "First Name": fake.first_name_male() if sex=="M" else fake.first_name_female(),
                    "Last Name": fake.last_name(),
                    "Sex": sex,
                    #Parental Identification: they must not have the same parents and FOR NOW hetero relationships ONLY
                        #Father ID - implement logic for sex==M, ages within the same age bracket of other parent
                        #Mother ID - implement logic for sex==F, ages within the same age bracket of other parent
                    "Adopted": adopted,

                    #Family Name - a static surname drawn from the proband for pedigree title

                    #"Multiple Birth Type": multiBirthtype,
                    #Multiple birth id must be within the same age bracket, further rules below:
                        #implement logic for fraternal(dizygotic) and identical (monozygotic), must be two of type per set
                        #implement logic for triplets which there must be three of type per set, does not matter the sex combo

                    #Spouse Number, the number assigned to spouses based on first marriage = 1 and so on. Might need to be manual input until logic is considered
                        #Consult Spouse table for info
                    #Spouse ID
                        # Implement logic which must be within the same age bracket, date of birth not matching partner, must not have the same parents

                    "Date of Birth":dob,
                    "Deceased": deceased,
                    "Date of Death": create_dod(dob) if deceased=="Yes" else " ",
                    "Race": race,
                    "Hispanic": 'Hispanic' if race=="Other" else "Not Hispanic"

                    #ICD-o-3 morphology codes & names
                    #ICD-o-3 sites codes & names, some are based on sex
                    #ICD 10 codes & names, some are based on sex

                    #ICD 9-CM codes & names, some are based on sex

                    })
'''

def datagenerate_person(person_id, father = None, mother = None):

    #print("making proband")
    sex = np.random.choice(["M", "F"], p=[0.5, 0.5])
    adopted = np.random.choice(["In", "Out", "No"], p=[0.0023, 0.0002, 0.9975])
    dob = fake.date_of_birth(minimum_age=18, maximum_age=100)
    deceased = np.random.choice(["Yes", "No"], p=[0.25, 0.75])
    #multiBirthtype = np.random.choice(["Fraternal", "Identical", "Triplets", " "], p=[0.03, 0.01, 0.005, 0.955])
    race = np.random.choice(["American Indian or Alaskan Native", "Asian", "Native Hawaiian or Other Pacific Islander", "Black or African American", "White", "Other"],
        p=[0.013, 0.061, 0.003, 0.136, 0.758, 0.029])

    person = {
            "Patient ID": person_id,
            "First Name": fake.first_name_male() if sex=="M" else fake.first_name_female(),
            "Last Name": fake.last_name(),
            "Sex": sex,
            "Adopted": adopted,
            "Date of Birth":dob.strftime("%m/%d/%Y"),
            "Deceased": deceased,
            "Date of Death": create_dod(dob).strftime("%m/%d/%Y") if deceased=="Yes" else " ",
            "Race": race,
            "Ethnicity": 'Hispanic' if race=="Other" else "Not Hispanic"
    }

    if(father is not None):
        person["father"] = father

    if(mother is not None):
        person["mother"] = mother

    return(person)

if __name__ == '__main__':
    print("starting")
    data = {}
    proband_id = fake.uuid4();

    #patients = 10
    headers = ["Patient ID", "First Name", "Last Name", "Sex", "Adopted", "Date of Birth", "Deceased", "Date of Death", "Race", "Ethnicity"]
    #datagenerate(patients, headers)

    father_id = fake.uuid4();
    father = datagenerate_person(father_id)
    mother_id = fake.uuid4();
    mother = datagenerate_person(mother_id)
    #p_grandfather = datagenerate_person()
    #p_grandmother = datagenerate_person()
    #m_grandfather = datagenerate_person()
    #m_grandmother = datagenerate_person()

    person = datagenerate_person(proband_id, father_id, mother_id)

    data["proband_id"] = proband_id
    #print(person)
    print(json.dumps(person, indent=4))

    #print("CSV generation complete!")
