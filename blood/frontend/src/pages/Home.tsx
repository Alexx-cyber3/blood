import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container py-5 text-center">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="display-4 fw-bold text-danger mb-4">Every Drop Counts!</h1>
          <p className="lead mb-5">
            The Blood Donation Match System connects donors with recipients in real-time. 
            Register today to save a life, or request blood for an emergency.
          </p>
          <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
            <Link to="/register" className="btn btn-danger btn-lg px-4 gap-3">Donate Blood</Link>
            <Link to="/request" className="btn btn-outline-danger btn-lg px-4">Find Donors</Link>
          </div>
        </div>
      </div>

      <div className="row mt-5 pt-5">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h3 className="h5 fw-bold">1. Register</h3>
              <p className="text-muted">Fill in your details and blood group to join our network of life-savers.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h3 className="h5 fw-bold">2. Match</h3>
              <p className="text-muted">Our system instantly matches requests with eligible donors in the same location.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h3 className="h5 fw-bold">3. Save Life</h3>
              <p className="text-muted">Get notified and connect directly to facilitate quick blood donation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
