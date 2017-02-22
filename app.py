
# This is the entry point of our EHR Application. 
# The web application uses Flask, a micro-framework for Python.
# Flask is handling all the HTTP requests.
# This file is the brain of our Web Application i.e Healthcare Electronic Health Records
# Author: Zaaviar Ali email: xyle.xavier@gmail.com
# Last Updated: 24-Jan-2016


from flask import Flask, redirect, render_template, request, session, url_for,send_from_directory,jsonify, session
import requests
#from flask_session import Session
from tempfile import gettempdir
import datetime, pytz
# passing the file name to the Flask constructor
app = Flask(__name__)
app.secret_key = "JessicaWebAppDrChrono"



@app.route('/logout')
def logout():
    session.clear()
    return ''


# homepage route of the web-app
@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

#
@app.route('/authenticate')
def authenticate():
    print(request.args.get('code'))
    response = requests.post('https://drchrono.com/o/token/', data={
        'code': request.args.get('code'),
        'grant_type': 'authorization_code',
        'redirect_uri': 'https://ide50-xavi4.cs50.io/authenticate',
        'client_id': 'hS7jz4iDshQPovuwzhjalDSdySYfQ4FVqNZHK2G3',
        'client_secret': 'lsvvgQzEAfd7RfGODyvGnFZaf1Y3iPlwAvPZD7M7uaE4Hj6FGqnNiHAOvWG5XFNl4A1HLVABlQgTD84pp9v6ONoYl32CkwO7jx3YWw8hB9D8nN74Qxz4U0w6nWqzbWQz'
    })
    #response.raise_for_status()
    if response.status_code is 200:
        data = response.json()
        expires_timestamp = datetime.datetime.now(pytz.utc) + datetime.timedelta(seconds=data['expires_in'])
        session['data'] = data
        session['expiry'] = expires_timestamp;
        response = requests.get('https://drchrono.com/api/users/current', headers={
        'Authorization': 'Bearer %s' % session['data']['access_token'],})
        data = response.json()
        session['user'] = data
        #return jsonify(data)
        return send_from_directory('static', 'login_control.html')
    
    else:
        error = {'error': 404}
        session['data'] = None
        return redirect(url_for("/"))
        #return jsonify(error)
        
# get list of all the medicated patients
@app.route('/getAllmPatients')
def getAllmpatients():
    headers = {
    'Authorization': 'Bearer '+session['data']['access_token'],
    }
    patients = []
    #patients_url = 'https://drchrono.com/api/patients'
    patients_url = 'https://drchrono.com/api/medications'
    while patients_url:
        data = requests.get(patients_url, headers=headers).json()
        patients.extend(data['results'])
        patients_url = data['next'] # A JSON null on the last page
    return jsonify(patients)

# get list of all the medicated patients
@app.route('/getAllPatients')
def getAllpatients():
    headers = {
    'Authorization': 'Bearer '+session['data']['access_token'],
    }
    patients = []
    patients_url = 'https://drchrono.com/api/patients'
    #patients_url = 'https://drchrono.com/api/patients_summary'
    while patients_url:
        data = requests.get(patients_url, headers=headers).json()
        patients.extend(data['results'])
        patients_url = data['next'] # A JSON null on the last page
    return jsonify(patients)
    
@app.route('/login_check')
def login_check():
    if  session['data']:
        return jsonify({'status':1})
    else:
        return jsonify({'status':0})



@app.route('/sendPrescriptionNote')
def sendPrescriptionNote():
    pid = request.args.get('id')
    value = request.args.get('note')
    headers = {
    'Authorization': 'Bearer '+session['data']['access_token'],
    }
    patients = []
    patients_url = 'https://drchrono.com//api/medications'
    #patients_url = 'https://drchrono.com/api/patients_summary'
    while patients_url:
        data = requests.get(patients_url, headers=headers).json()
        patients.extend(data['results'])
        patients_url = data['next'] # A JSON null on the last page
    meds = []
    for p in patients:
        if str(p['patient']) == str(pid):
            meds.append(p)
            
    for p in meds:
        url = 'https://drchrono.com/api/medications/'+str(p['id'])+'/append_to_pharmacy_note'+'?access_token='+session['data']['access_token']
        response = requests.patch(url,data={'text':value})
    return jsonify({'status':1})

@app.route('/sendtoAll')
def sendtoAll():
    value = request.args.get('note')
    headers = {
    'Authorization': 'Bearer '+session['data']['access_token'],
    }
    patients = []
    patients_url = 'https://drchrono.com/api/medications'
    #patients_url = 'https://drchrono.com/api/patients_summary'
    while patients_url:
        data = requests.get(patients_url, headers=headers).json()
        patients.extend(data['results'])
        patients_url = data['next'] # A JSON null on the last page
        
    for p in patients:
        print(str(p['id']))
        url = 'https://drchrono.com/api/medications/{}'.format(p['id'])
        url += '/append_to_pharmacy_note'+'?access_token='+session['data']['access_token']
        response = requests.patch(url,data={'text':value})
        data = response
        print(data)
    return jsonify({'status':1})


@app.route('/getPS')
def prescriptionSummary():
    return send_from_directory('static', 'ps.html')

@app.route('/getMeds')
def getMeds():
    pid = request.args.get('id')
    print(pid)
    headers = {
    'Authorization': 'Bearer '+session['data']['access_token'],
    }
    patients = []
    patients_url = 'https://drchrono.com//api/medications'
    #patients_url = 'https://drchrono.com/api/patients_summary'
    while patients_url:
        data = requests.get(patients_url, headers=headers).json()
        patients.extend(data['results'])
        patients_url = data['next'] # A JSON null on the last page
    meds = []
    for p in patients:
        if str(p['patient']) == str(pid):
            meds.append(p)
    return jsonify(meds)

# get all the medicated patients
@app.route('/getMedPatients')
def getMedPatients():
    headers = {
    'Authorization': 'Bearer '+session['data']['access_token'],
    }
    patients = []
    meds = []
    meds_url = 'https://drchrono.com/api/medications'
    patients_url = 'https://drchrono.com/api/patients'
    #patients_url = 'https://drchrono.com/api/patients_summary'
    
    while patients_url:
        data = requests.get(patients_url, headers=headers).json()
        patients.extend(data['results'])
        patients_url = data['next'] # A JSON null on the last page
    
    while meds_url:
        data = requests.get(meds_url, headers=headers).json()
        meds.extend(data['results'])
        meds_url = data['next'] # A JSON null on the last page
    allMedPatIdSet = set()
    allMedPat = []
    for p in patients:
        for m in meds:
            if p['id'] == m['patient']:
                flag = False
                for idPat in allMedPatIdSet:
                    if idPat == p['id']:
                        flag = True
                        break
                if flag == False:
                    allMedPatIdSet.add(p['id'])
                    allMedPat.append(p)
    return jsonify(allMedPat)

# serves up the requested javascript file
@app.route('/public/js/<path:path>')
def send_js(path):
    return send_from_directory('public/js', path)

# serves up the requested css file
@app.route('/public/css/<path:path>')
def send_css(path):
    return send_from_directory('public/css', path)


# serves up the requested image file
@app.route('/public/images/<path:path>')
def send_images(path):
    return send_from_directory('public/images', path)

@app.route('/home')
def home():
    return send_from_directory('static', 'mhome.html')


# Entry-point of the app.Run the server, i.e start listening for incoming request when this app is run
if __name__ == "__main__":
    app.run()
     
