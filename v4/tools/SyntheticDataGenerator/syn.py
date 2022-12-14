import json
from faker import Faker
from datetime import timedelta, date
import numpy as np
import pandas as pd

fake = Faker()

#global variable, main data object
data={}
#Faker.seed(1)

def create_dod(inDate):
    # Using builtin support of timedelta, add 26 years (in days accounting for up to 4 leap years), and 100 years as a cap
    age_min_offset = 9500       #Minimum age at death is around 26
    age_max_offset = 36900      #Maximum age at death is around 100
    dod_min  = inDate + timedelta(days=age_min_offset)
    dod_max = inDate + timedelta(days=age_max_offset)
    if(dod_max - date.today() > timedelta(0)):
        dod_max = date.today()
    dod_out = fake.date_between_dates(date_start=dod_min, date_end=dod_max)
    return dod_out

def diagnosis_date(inDate):
    age_min_offset = 8365       #Minimum age at diagnosis is around 23
    age_max_offset = 25555      #Maximum age at diagnosis is around 70
    diagnosis_min  = inDate + timedelta(days=age_min_offset)
    diagnosis_max = inDate + timedelta(days=age_max_offset)
    if(diagnosis_max - date.today() > timedelta(0)):
        diagnosis_max = date.today()
    diagnosis_out = fake.date_between_dates(date_start=diagnosis_min, date_end=diagnosis_max)
    return diagnosis_out


#DATAFRAMES MADE FROM READING IN CSV FILES 
icdo3morph = pd.read_csv('ICD_O_3_MORPH_CODES.csv')
icdo3site = pd.read_csv('ICD_O_3_SITE_CODES.csv')
icd9 = pd.read_csv('ICD_9_CODES.csv')
icd10 = pd.read_csv('ICD_10_CODES.csv')


def icdo3_morph_output():
    icdo3_morph_sample = icdo3morph.sample()
    icdo3_morph_json = icdo3_morph_sample.to_string(index=False, header=False)
    return icdo3_morph_json

def icdo3_site_output():
    icdo3_site_sample = icdo3site.sample()
    icdo3_site_json = icdo3_site_sample.to_string(index=False, header=False)
    return icdo3_site_json

def icd9_output():
    icd9sample = icd9.sample()
    icd9json = icd9sample.to_string(index=False, header=False)
    return icd9json

def icd10_output():
    icd10sample = icd10.sample() 
    icd10json = icd10sample.to_string(index=False, header=False)
    return icd10json


def datagenerate_person(person_id, sex, dob, father = None, mother = None, p_gpa = None, p_gma = None, m_gpa = None, m_gma = None, ):
    
    adopted = np.random.choice(["In", "Out", "No"], p=[0.0023, 0.0002, 0.9975])
    deceased = bool(np.random.choice([True, False], p=[0.25, 0.75]))
    #multiBirthtype = np.random.choice(["Fraternal", "Identical", "Triplets", " "], p=[0.03, 0.01, 0.005, 0.955])
    race = np.random.choice(["American Indian or Alaskan Native", "Asian", "Native Hawaiian or Other Pacific Islander", "Black or African American", "White", "Other"], 
        p=[0.013, 0.061, 0.003, 0.136, 0.758, 0.029])
    first_name = fake.first_name_male() if sex=="Male" else fake.first_name_female() 
    last_name = fake.last_name()

    #TESTING ONLY VARIABLES
    '''
    cancer = np.random.choice(["Yes", "No"], p=[0.99, 0.01])
    noncancer = np.random.choice(["Yes", "No"], p=[0.99, 0.01])
    procedure = np.random.choice(["Yes", "No"], p=[0.99, 0.01])
    '''

    #VARIABLES TO BE USED IN NONTESTING

    cancer = np.random.choice(["Yes", "No"], p=[0.75, 0.25])
    noncancer = np.random.choice(["Yes", "No"], p=[0.75, 0.25])
    procedure = np.random.choice(["Yes", "No"], p=[0.50, 0.50])


    proband = {
            "name": first_name + " " + last_name,
            "Patient ID": person_id,
            "demographics": {
                "gender": sex,
                "birthdate":dob.strftime('%m/%d/%Y'),
                "deathdate":create_dod(dob).strftime('%m/%d/%Y') if deceased==True else "",
            },
            "diseases":{
                "code/morph": icdo3_morph_output() if cancer=="Yes" else '',
                "site": icdo3_site_output() if cancer=="Yes" else '',
                "cancer_date_of_diagnosis": diagnosis_date(dob).strftime('%m/%d/%Y') if cancer=="Yes" else '',
                "icd10": icd10_output() if noncancer=="Yes" else '',
                "noncancer_date_of_diagnosis": diagnosis_date(dob).strftime('%m/%d/%Y') if noncancer=="Yes" else '',
            },
            "procedures":{
                "icd9": icd9_output() if procedure=="Yes" else '',
                "date_of_diagnosis": diagnosis_date(dob).strftime('%m/%d/%Y') if procedure=="Yes" else '',
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

def make_children(num_children, dob, father_id, mother_id):
    children = []
    for i in range(num_children):
        person_id = fake.uuid4()
        sex_assigned = np.random.choice(["Male", "Female"], p=[0.5, 0.5]) 
        #fathers_surname
        person = datagenerate_person(person_id, sex_assigned, dob, father_id, mother_id)
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

#######################################################
    def dob_generator(minimum_in, maximum_in):
        return fake.date_of_birth(minimum_age=minimum_in, maximum_age=maximum_in)

    '''
    g_grandparent_gen_dob = fake.date_of_birth(minimum_age=109, maximum_age=111)
    grandparent_gen_dob = fake.date_of_birth(minimum_age=90, maximum_age=94)
    parent_gen_dob = fake.date_of_birth(minimum_age=72, maximum_age=76)
    proband_gen_dob = fake.date_of_birth(minimum_age=54, maximum_age=58)
    kids_gen_dob = fake.date_of_birth(minimum_age=36, maximum_age=40)
    grandkids_gen_dob = fake.date_of_birth(minimum_age=18, maximum_age=22)
    g_grandkids_gen_dob = fake.date_of_birth(minimum_age=0, maximum_age=1)
    '''

########################################################    

    probandsex = np.random.choice(["Male", "Female"], p=[0.5, 0.5])
    proband = datagenerate_person(proband_id, probandsex, dob_generator(54, 58), father_id, mother_id)

    father = datagenerate_person(father_id, "Male", dob_generator(72, 76), p_gpa_id, p_gma_id)
    mother = datagenerate_person(mother_id, "Female", dob_generator(72, 76), m_gpa_id, m_gma_id)
    
    p_gpa = datagenerate_person(p_gpa_id, "Male", dob_generator(90, 94))
    p_gma = datagenerate_person(p_gma_id, "Female", dob_generator(90, 94))

    m_gpa = datagenerate_person(m_gpa_id, "Male", dob_generator(90, 94))
    m_gma = datagenerate_person(m_gma_id, "Female", dob_generator(90, 94))

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

    num_children = 1 #used for testing changes in code without many family members
    #num_children = np.random.randint(1, 4) 
    siblings = make_children(num_children, dob_generator(54, 58), father_id, mother_id)
    fathers_siblings = make_children(num_children, dob_generator(72, 76), p_gpa_id, p_gma_id)
    mothers_siblings = make_children(num_children, dob_generator(72, 76), m_gpa_id, m_gma_id)
    proband_children = make_children(num_children, dob_generator(36, 40), proband_id, None)

    for person_id in siblings:
        siblings_children = make_children(num_children, dob_generator(36, 40), person_id, None)

    for person_id in fathers_siblings:
        fathers_siblings_children = make_children(num_children, dob_generator(54, 58), person_id, None)

    for person_id in mothers_siblings:
        mothers_siblings_children = make_children(num_children, dob_generator(54, 58), person_id, None)

    #for person_id in proband_children:
        #proband_grandchildren = make_children(num_children, dob_generator(18, 22), person_id, None)


    print(json.dumps(data, indent=4))