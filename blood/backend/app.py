from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blood_donation.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Models
class Donor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    blood_group = db.Column(db.String(5), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    contact = db.Column(db.String(15), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    last_donation = db.Column(db.String(20)) # Store as string for simplicity in prototype

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "blood_group": self.blood_group,
            "location": self.location,
            "contact": self.contact,
            "age": self.age,
            "last_donation": self.last_donation
        }

class BloodRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    blood_group = db.Column(db.String(5), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    urgency = db.Column(db.String(20), nullable=False)
    patient_name = db.Column(db.String(100))
    contact = db.Column(db.String(15))
    status = db.Column(db.String(20), default='Pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "blood_group": self.blood_group,
            "location": self.location,
            "urgency": self.urgency,
            "patient_name": self.patient_name,
            "contact": self.contact,
            "status": self.status,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }

# Initialize Database
with app.app_context():
    db.create_all()

# Routes
@app.route('/api/donors', methods=['POST'])
def register_donor():
    data = request.json
    new_donor = Donor(
        name=data['name'],
        blood_group=data['blood_group'],
        location=data['location'],
        contact=data['contact'],
        age=data['age'],
        last_donation=data.get('last_donation', '')
    )
    db.session.add(new_donor)
    db.session.commit()
    return jsonify({"message": "Donor registered successfully", "id": new_donor.id}), 201

@app.route('/api/donors', methods=['GET'])
def get_donors():
    donors = Donor.query.all()
    return jsonify([d.to_dict() for d in donors])

@app.route('/api/donors/<int:donor_id>', methods=['DELETE'])
def delete_donor(donor_id):
    donor = Donor.query.get_or_404(donor_id)
    db.session.delete(donor)
    db.session.commit()
    return jsonify({"message": "Donor deleted successfully"}), 200

@app.route('/api/requests', methods=['POST'])
def create_request():
    data = request.json
    new_request = BloodRequest(
        blood_group=data['blood_group'],
        location=data['location'],
        urgency=data['urgency'],
        patient_name=data.get('patient_name', 'Anonymous'),
        contact=data['contact']
    )
    db.session.add(new_request)
    db.session.commit()
    return jsonify({"message": "Request created successfully", "id": new_request.id}), 201

@app.route('/api/requests', methods=['GET'])
def get_requests():
    requests = BloodRequest.query.all()
    return jsonify([r.to_dict() for r in requests])

@app.route('/api/requests/<int:request_id>', methods=['DELETE'])
def delete_request(request_id):
    blood_req = BloodRequest.query.get_or_404(request_id)
    db.session.delete(blood_req)
    db.session.commit()
    return jsonify({"message": "Request deleted successfully"}), 200

@app.route('/api/match/<int:request_id>', methods=['GET'])
def match_donors(request_id):
    blood_req = BloodRequest.query.get_or_404(request_id)
    # Simple matching logic: Same blood group and Same location
    matches = Donor.query.filter_by(
        blood_group=blood_req.blood_group,
        location=blood_req.location
    ).all()
    
    # In a real app, you'd trigger SMS/Email here.
    # For now, we simulate the "notification sent" state.
    results = [m.to_dict() for m in matches]
    return jsonify({
        "request": blood_req.to_dict(),
        "matches": results,
        "notification_status": "Simulated: Notifications would be sent to {} donors.".format(len(results))
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
