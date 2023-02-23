import json
from faker import Faker
from datetime import timedelta, date
import numpy as np
import pandas as pd
import argparse
import sys

fake = Faker()

#global variable, main data object
data={}
#Faker.seed(1)

def is_str(value_in):
    return type(value_in) is str

#need to change code to reflect age AT diagnosis
def calculateAge(dob):
    today = date.today()
    age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
    return age

#DATE OF DEATH NEEDS CONFIGURATION TO MAKE SURE THE RANDOMLY GENERATED DEATH IS AFTER A CERTAIN AGE
def create_dod(inDate):
    # Using builtin support of timedelta, add 26 years (in days accounting for up to 4 leap years), and 100 years as a cap
    age_min_offset = 6600      #Minimum age at death is around 18
    age_max_offset = 36900      #Maximum age at death is around 100
    dod_min  = inDate + timedelta(days=age_min_offset)
    dod_max = inDate + timedelta(days=age_max_offset)
    dod_out = ""
    if(dod_max - date.today() > timedelta(0)):
        dod_max = date.today()
        dod_out = fake.date_between_dates(date_start=dod_min, date_end=dod_max)
    return dod_out
'''
def max_age(arr):
    max_age = 0
    for x in arr:
        d = date.strptime(data[x]["demographics"]["birthdate"], '%Y-%m-%d').timestamp()
        print(d)
        if (d > max_age):
            max_age = d
    return max_age

def update_dod(id, children):
    #if (data[id]["deceased"] is not None):
    #    return
    print("boo")
    d = date.strptime(data[id]["demographics"]["deathdate"], '%Y-%m-%d').timestamp()
    if (d < max_age): d = max_age
    data[id]["demographics"]["deathdate"] = date(d)
'''

def diagnosis_date(inDate):
    age_min_offset = 0       #Minimum age at diagnosis is 0
    age_max_offset = 25555      #Maximum age at diagnosis is around 70
    diagnosis_min  = inDate + timedelta(days=age_min_offset)
    diagnosis_max = inDate + timedelta(days=age_max_offset)
    diagnosis_out = ""
    if(diagnosis_max - date.today() > timedelta(0)):
        diagnosis_max = date.today()
        diagnosis_out = fake.date_between_dates(date_start=diagnosis_min, date_end=diagnosis_max)
    return diagnosis_out


#DATAFRAMES MADE FROM READING IN CSV FILES
icdo3morph = pd.read_csv('ICD_O_3_MORPH_CODES.csv')
icdo3site = pd.read_csv('ICD_O_3_SITE_CODES.csv')
icd9 = pd.read_csv('ICD_9_CODES.csv')
icd10 = pd.read_csv('ICD_10_CODES.csv')
lat_diag = pd.read_csv('LATERALITY.csv')
procedure_intent = pd.read_csv('INTENT.csv')

def icdo3_morph_output():
    icdo3_morph_sample = icdo3morph.sample()
    icdo3_morph = icdo3_morph_sample.to_string(index=False, header=False)
    #print(icdo3_morph.split(" ", 1)[0])
    return icdo3_morph

def icdo3_site_output():
    icdo3_site_sample = icdo3site.sample()
    icdo3_site = icdo3_site_sample.to_string(index=False, header=False)
    return icdo3_site

def icd9_output():
    icd9sample = icd9.sample()
    icd_9 = icd9sample.to_string(index=False, header=False)
    return icd_9

def icd10_output():
    icd10sample = icd10.sample()
    icd_10 = icd10sample.to_string(index=False, header=False)
    return icd_10

def lat_diag_output():
    lat_diag_sample = lat_diag.sample()
    latdiag = lat_diag_sample.to_string(index=False, header=False)
    return latdiag

def procedure_intent_output():
    procedure_intent_sample = procedure_intent.sample()
    proc_intent = procedure_intent_sample.to_string(index=False, header=False)
    return proc_intent


def datagenerate_person(person_id, sex, dob, father = None, mother = None, paternal_grandfather = None, paternal_grandmother = None, maternal_grandfather = None, maternal_grandmother = None):


    adopted = np.random.choice(["In", "Out", "No"], p=[0.0023, 0.0002, 0.9975])
    deceased = bool(np.random.choice([True, False], p=[0.15, 0.85]))
    multiBirthtype = np.random.choice(["Fraternal", "Identical", "Triplets", " "], p=[0.03, 0.01, 0.005, 0.955])
    race = np.random.choice(["American Indian or Alaskan Native", "Asian", "Native Hawaiian or Other Pacific Islander", "Black or African American", "White", "Other"],
        p=[0.013, 0.061, 0.003, 0.136, 0.758, 0.029])
    first_name = fake.first_name_male() if sex=="Male" else fake.first_name_female()
    last_name = fake.last_name()
    practioner_name = fake.first_name() + " " + fake.last_name()
    date_of_death = create_dod(dob)

    age_out = calculateAge(dob)
    today_date = date.today()

    icd_morph = icdo3_morph_output()
    icd3_site = icdo3_site_output()
    icd9_code = icd9_output()
    lateraily_canc = lat_diag_output()
    cancer_diag_meth = np.random.choice(["Pathology Report", "Person Relation Report", "Physician/Consult Report", "Radiology/Imaging Report", "Self Report", "Study Pathologist Determined", ""], p=[0.175, 0.056, 0.009, 0.359, 0.054, 0.207, 0.14])
    non_cancer_diag_meth = np.random.choice(["Autopsy Report", "Cytogenetic Assay Report", "Pathology Report", "Person Relation Report", "Physician/Consult Report", "Radiology/Imaging Report", "Self Report", "Study Investigator Determined", 
        "Study Pathologist Determined", "Study Radiologist Review", "Surgery/Operation Report", "", "Flow Cytometry Report"], 
        p=[0.0002, 0.0014, 0.1477, 0.1212, 0.1206, 0.3243, 0.2664, 0.0007, 0.0043, 0.0031, 0.0084, 0.0006, 0.0011])
    #TESTING ONLY VARIABLES
    
    cancer = np.random.choice(["Yes", "No"], p=[0.99, 0.01])
    noncancer = np.random.choice(["Yes", "No"], p=[0.99, 0.01])
    procedure = np.random.choice(["Yes", "No"], p=[0.99, 0.01])
    

    #VARIABLES TO BE USED IN NONTESTING
    '''
    cancer = np.random.choice(["Yes", "No"], p=[0.25, 0.75])
    noncancer = np.random.choice(["Yes", "No"], p=[0.60, 0.40])
    procedure = np.random.choice(["Yes", "No"], p=[0.25, 0.75])
    '''

    #Proband = {} here is a dictionary
    proband = {
        "individuals":
        {
            "id": person_id,
            "name": 
                [
                    {
                        "use" : "official",
                        "family" : "",
                        "given" : [last_name, first_name]
                    },
                    
                    {
                        "use" : "usual",
                        "given" : [first_name]  #May not be able to synthetically generate accurate nicknames based on given name
                    },
                    
                    {
                        "use" : "maiden", #Need to add if else for if they are female, fill in the blanks 
                        "family" : "",
                        "given" : [last_name, first_name],
                    }
                ],
            "gender" : sex,
            "birthDate": dob.strftime('%Y-%m-%d'),
            "deceasedBoolean": deceased,
            "deceasedDateTime" : 
            {
                "extension" : 
                [{
                    #"url" : "http://hl7.org/fhir/StructureDefinition/patient-birthTime",
                    "valueDateTime" : date_of_death.strftime('%Y-%m-%d') if (deceased==True and not is_str(create_dod(dob))) else ''
                }]
            },
            
            "adopted": adopted,
            "race": race,
            "ethnicity": 'Hispanic' if race=="Other" else "Not Hispanic",
            
            #el-if for if a condition is yes, display everything in relation, otherwise don't show the empty condition fields
            "conditions":
            [{
                "code" : 
                    {
                        "coding" : 
                        [{
                            "system" : "ICD-O-3 Morphology",
                            "code" : icd_morph.split(" ", 1)[0] if cancer=="Yes" else '',   #Potential to add non_cancer on same line with a condition added but icd is different if non_cancer == Yes
                            "display" : icd_morph if cancer=="Yes" else '', #EXAMPLE:"Burn of ear"
                        }],
                    },
                    "bodySite" : 
                    [{
                        "coding" : 
                        [{
                            "system" : "ICD-O-3 Site",
                            "code" :icd3_site.split(" ", 1)[0] if cancer=="Yes" else '',
                            "display" : icd3_site if cancer=="Yes" else '',#"Left external ear structure"
                        }],
                    }],
                "onsetDateTime" : diagnosis_date(dob).strftime('%Y-%m-%d') if (cancer=="Yes" and not is_str(diagnosis_date(dob))) else '',
                "onsetAge" : 
                {
                    "value" : age_out,
                    "unit" : "years",
                    "system" : "Example: http://unitsofmeasure.org",
                    "code" : "a"
                },
                "recordedDate" : today_date.strftime('%Y-%m-%d'),
                "evidence" : 
                [{
                    "reference" : 
                    {
                        "reference" : cancer_diag_meth,
                        "display" : cancer_diag_meth
                    }
                }]

            #ABOVE DOES NOT INCLUDE NON_CANCER CONDITIONS
                
            }],

            #el-if for if a procedure is yes, display everything in relation otherwise, don't show the empty procedure fields
            "procedure":
            [{
                "status" : "completed",
                "category" : 
                [{
                    "coding" : 
                    [{
                        #"system" : "",
                        #"code" : "",
                        "display" : procedure_intent_output() if procedure=="Yes" else '',
                    }],
                }],
                "code" : 
                {
                    "coding" : 
                    [{
                        "system" : "ICD 9",
                        "code" : icd9_code.split(" ", 1)[0] if cancer=="Yes" or noncancer =="Yes" else '',
                        "display" : icd9_code if procedure=="Yes" else '',
                    }],
                    #"text" : "",#"Appendectomy"
                },
                "occurrenceDateTime": diagnosis_date(dob).strftime('%Y-%m-%d') if (procedure=="Yes" and not is_str(diagnosis_date(dob))) else '',
                "recorded" : diagnosis_date(dob).strftime('%Y-%m-%d') if (procedure=="Yes" and not is_str(diagnosis_date(dob))) else '',
                "performer" : 
                [{
                    "actor" : 
                    {
                        "reference" : "Practitioner",
                        "display" : "Dr. " + practioner_name,
                    }
                }],
            }],
        },
    }
    
    if(father is not None):
        proband["father"] = father

    if(mother is not None):
        proband["mother"] = mother

    if(paternal_grandfather is not None):
        father["father"] = paternal_grandfather

    if(paternal_grandmother is not None):
        father["mother"] = paternal_grandmother

    if(maternal_grandfather is not None):
        mother["father"] = maternal_grandfather

    if(maternal_grandmother is not None):
        mother["mother"] = maternal_grandmother
    
    return(proband)

###############################################

def make_children(min, max, dob, father_id, mother_id):
    num_children = 0

    if (int(min) < int(max)):
        num_children = np.random.randint(min, max)
    else:
        num_children = int(min)

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
##############################################################################################################

def generate_relationships(person_id, other_person_id):
    #Currently only generates relationship for father, mother, all grandparents of the proband ONLY
    relationships = {
        "relationships":
        {
            "individual_id": person_id,
            "relation":
            {
                "label": "", #Mother of, father of, sibling of, etc. 
                "relative_id": other_person_id 
            }
        }
    }
    return (relationships)

##############################################################################################################

def dob_generator(minimum_in, maximum_in):
    return fake.date_of_birth(minimum_age=minimum_in, maximum_age=maximum_in)
    '''
    g_grandparent_gen_dob = fake.date_of_birth(minimum_age=109, maximum_age=111)
    g_grandkids_gen_dob = fake.date_of_birth(minimum_age=0, maximum_age=1)
    '''
########################################################

# Below function supports min/max as 2 values: <min>-<max> or 1 value: <min>
def get_min_max(input_string):
    min_max = input_string.split("-")
    if (len(min_max) >= 2): return min_max[0], min_max[1]
    else: return min_max[0], min_max[0]

def make_family():
    global args

    proband_id = fake.uuid4()
    father_id = fake.uuid4()
    mother_id = fake.uuid4()

    paternal_grandfather_id = fake.uuid4()
    paternal_grandmother_id = fake.uuid4()

    maternal_grandfather_id = fake.uuid4()
    maternal_grandmother_id = fake.uuid4()

    data["proband"] = proband_id
    data["people"] = {}
    data["relationships"] = {}

    probandsex = np.random.choice(["Male", "Female"], p=[0.5, 0.5])

    #generates individual persons info
    proband = datagenerate_person(proband_id, probandsex, dob_generator(54, 58), father_id, mother_id)
    father = datagenerate_person(father_id, "Male", dob_generator(72, 76), paternal_grandfather_id, paternal_grandmother_id)
    mother = datagenerate_person(mother_id, "Female", dob_generator(72, 76), maternal_grandfather_id, maternal_grandmother_id)
    paternal_grandfather = datagenerate_person(paternal_grandfather_id, "Male", dob_generator(90, 94))
    paternal_grandmother = datagenerate_person(paternal_grandmother_id, "Female", dob_generator(90, 94))
    maternal_grandfather = datagenerate_person(maternal_grandfather_id, "Male", dob_generator(90, 94))
    maternal_grandmother = datagenerate_person(maternal_grandmother_id, "Female", dob_generator(90, 94))
    #generate relationship
    proband_father = generate_relationships(father_id, proband_id)
    proband_mother = generate_relationships(mother_id, proband_id)
    proband_p_gpa = generate_relationships(paternal_grandfather_id, father_id)
    proband_p_gma = generate_relationships(paternal_grandmother_id, father_id)
    proband_m_gpa = generate_relationships(maternal_grandfather_id, mother_id)
    proband_m_gma = generate_relationships(maternal_grandmother_id, mother_id)
    #Generates individuals
    data["people"][proband_id] = proband
    data["people"][father_id] = father
    data["people"][mother_id] = mother
    data["people"][paternal_grandfather_id] = paternal_grandfather
    data["people"][paternal_grandmother_id] = paternal_grandmother
    data["people"][maternal_grandfather_id] = maternal_grandfather
    data["people"][maternal_grandmother_id] = maternal_grandmother
    #Generates the relationships
    data["relationships"][father_id] = proband_father
    data["relationships"][mother_id] = proband_mother
    data["relationships"][paternal_grandfather_id] = proband_p_gpa
    data["relationships"][paternal_grandmother_id] = proband_p_gma
    data["relationships"][maternal_grandfather_id] = proband_m_gpa
    data["relationships"][maternal_grandmother_id] = proband_m_gma

    # Make Children
    [min, max] = get_min_max(args.children)
    proband_children = make_children(min, max, dob_generator(36, 40), proband_id, None)

    # Make Siblings
    [min, max] = get_min_max(args.siblings)
    siblings = make_children(min, max, dob_generator(54, 58), data["people"][proband_id]["father"], data["people"][proband_id]["mother"])

    # Make Uncles and Aunts, Note both parents use the same max/min variable
    [min, max] = get_min_max(args.parents_siblings)
    fathers_siblings = make_children(min, max, dob_generator(72, 76), paternal_grandfather_id, paternal_grandmother_id)
    mothers_siblings = make_children(min, max, dob_generator(72, 76), maternal_grandfather_id, maternal_grandmother_id)
    
    for person_id in siblings:
        [min, max] = get_min_max(args.siblings_children)
        cousins = make_children(min, max, dob_generator(36, 40), person_id, None)

    for person_id in fathers_siblings:
        [min, max] = get_min_max(args.cousins)
        paternal_cousins = make_children(min, max, dob_generator(54, 58), person_id, None)

    for person_id in mothers_siblings:
        [min, max] = get_min_max(args.cousins)
        maternal_cousins = make_children(min, max, dob_generator(54, 58), person_id, None)

    for person_id in proband_children:
        [min, max] = get_min_max(args.grandchildren)
        proband_grandchildren = make_children(min, max, dob_generator(18, 22), person_id, None)
    
    if (args.output == None):
        sys.stderr.write("Writing to stdout\n")
        print(json.dumps(data, indent=4))
    else:
        sys.stderr.write("Writing to File: " + args.output + "\n")
        with open(args.output, 'w') as f:
            print(json.dumps(data, indent=4), file=f)

################################
# Argument Parser Functions

def parse_arguments():
    global args
    parser = argparse.ArgumentParser(description='The options are listed below')
    parser.add_argument("-c", "--children", nargs='?', help='<min>-<max>', default="1-3")
    parser.add_argument("-g", "--grandchildren", nargs='?', help='<min>-<max>', default="1-3")
    parser.add_argument("-s", "--siblings", nargs='?', help='<min>-<max>', default="1-3")
    parser.add_argument("-u", "--parents_siblings", nargs='?', help='<min>-<max>', default="1-3")
    parser.add_argument("-n", "--siblings_children", nargs='?', help='<min>-<max>', default="1-3")
    parser.add_argument("-C", "--cousins", nargs='?', help='<min>-<max>', default="1-3")
    parser.add_argument("-d", "--condition", nargs='?', help='<condition-filename>')
    parser.add_argument("-p", "--procedure", nargs='?', help='<procedure-filename>')

    parser.add_argument("output", nargs='?', default=None)

    args = parser.parse_args()

################################
# Main Functions Always at bottom of files

def main():
    global args
    parse_arguments()
    make_family()


if __name__ == "__main__":
    main()
