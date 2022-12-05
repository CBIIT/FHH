import json
from faker import Faker
from datetime import timedelta, date
import numpy as np

fake = Faker()

#global variable, main data object
data={}
#Faker.seed(1)

def create_dod(inDate):
    # Using builtin support of timedelta, add 18 years (in days accounting for up to 4 leap years), and 100 years as a cap
    age_min_offset = 6574
    age_max_offset = 36900
    dod_min  = inDate + timedelta(days=age_min_offset)
    dod_max = inDate + timedelta(days=age_max_offset)
    if(dod_max - date.today() > timedelta(0)):
        dod_max = date.today()
    dod_out = fake.date_between_dates(date_start=dod_min, date_end=dod_max)
    return dod_out


def datagenerate_person(person_id, sex, father = None, mother = None, p_gpa = None, p_gma = None, m_gpa = None, m_gma = None):
    
    #sex = np.random.choice(["Male", "Female"], p=[0.5, 0.5]) 
        #how to put the random sex in the siblings and potentially the generations below proband
    adopted = np.random.choice(["In", "Out", "No"], p=[0.0023, 0.0002, 0.9975])
    dob = fake.date_of_birth(minimum_age=18, maximum_age=100)
    dob_string = dob.strftime('%m/%d/%Y')
    deceased = bool(np.random.choice([True, False], p=[0.25, 0.75]))
    #multiBirthtype = np.random.choice(["Fraternal", "Identical", "Triplets", " "], p=[0.03, 0.01, 0.005, 0.955])
    race = np.random.choice(["American Indian or Alaskan Native", "Asian", "Native Hawaiian or Other Pacific Islander", "Black or African American", "White", "Other"], 
        p=[0.013, 0.061, 0.003, 0.136, 0.758, 0.029])
    first_name = fake.first_name_male() if sex=="Male" else fake.first_name_female() 
    last_name = fake.last_name()

    proband = {
            "name": first_name + " " + last_name,
            "Patient ID": person_id,
            "demographics": {
                "gender": sex,
                "birthdate":dob_string,
                "deathdate":create_dod(dob).strftime('%m/%d/%Y') if deceased==True else "",
            },

            "adopted": adopted,
            "deceased": deceased,
            "Race": race,
            "Ethnicity": 'Hispanic' if race=="Other" else "Not Hispanic"        
    }

    if(father is not None):
        proband["father"] = father
    
    if(mother is not None):
        proband["mother"] = mother

################################################
  #For Paternal Grandparents of Proband
    if(p_gpa is not None):
        father["father"] = p_gpa
    
    if(p_gma is not None):
        father["mother"] = p_gma

#############################################    
  #For Maternal Grandparents of Proband
    if(m_gpa is not None):
        mother["father"] = m_gpa        

    if(m_gma is not None):
        mother["mother"] = m_gma

    return(proband)    

###############################################

def make_children(num_children, father_id, mother_id):
    children = []
    for i in range(num_children):
        person_id = fake.uuid4()
        sex_assigned = np.random.choice(["Male", "Female"], p=[0.5, 0.5]) 
        person = datagenerate_person(person_id, sex_assigned, father_id, mother_id)
        #print(person_id)
        children.append(person_id)
        data["people"][person_id] = person
    return children

###############################################

    #implemention of diseases, using a sample from PPB noncancers

##############################################################################################################

if __name__ == '__main__':
    proband_id = fake.uuid4()
    father_id = fake.uuid4()
    mother_id = fake.uuid4()
    
    p_gpa_id = fake.uuid4()
    p_gma_id = fake.uuid4()
    
    m_gpa_id = fake.uuid4()
    m_gma_id = fake.uuid4()
    
    probandsex = np.random.choice(["Male", "Female"], p=[0.5, 0.5])
########################################################

    proband = datagenerate_person(proband_id, probandsex, father_id, mother_id)

    father = datagenerate_person(father_id, "Male", p_gpa_id, p_gma_id)
    mother = datagenerate_person(mother_id, "Female", m_gpa_id, m_gma_id)
    
    p_gpa = datagenerate_person(p_gpa_id, "Male")
    p_gma = datagenerate_person(p_gma_id, "Female")

    m_gpa = datagenerate_person(m_gpa_id, "Male")
    m_gma = datagenerate_person(m_gma_id, "Female")

#######################################################

    data["proband"] = proband_id
    data["people"] = {}

    data["people"][proband_id] = proband
    data["people"][father_id] = father
    data["people"][mother_id] = mother

    data["people"][p_gpa_id] = p_gpa
    data["people"][p_gma_id] = p_gma
    data["people"][m_gpa_id] = m_gpa
    data["people"][m_gma_id] = m_gma

#######################################################

    num_children = 1
    #num_children = np.random.randint(1, 4)
    siblings = make_children(num_children, father_id, mother_id)
    fathers_siblings = make_children(num_children, p_gpa_id, p_gma_id)
    mothers_siblings = make_children(num_children, m_gpa_id, m_gma_id)
    proband_children = make_children(num_children, proband_id, None)

    for person_id in siblings:
        siblings_children = make_children(num_children, person_id, None)

    for person_id in fathers_siblings:
        fathers_siblings_children = make_children(num_children, person_id, None)

    for person_id in mothers_siblings:
        mothers_siblings_children = make_children(num_children, person_id, None)

    for person_id in proband_children:
        proband_grandchildren = make_children(num_children, person_id, None)


    print(json.dumps(data, indent=4))
    
    #print(siblings)
    #print(fathers_siblings)
    #print(mothers_siblings)
    #print(grandchildren)