import { useEffect, useState } from "react";
import "../../styles/form.scss";
import { useNavigate } from "react-router";
import jwt_decode from "jwt-decode";
import BackButton from "../../components/BackButton";
import ErrorPage from "../../components/error/Error";
import PageContainer from "../../components/PageContainer";
import { postResearchLine } from "../../api/research_line";

export default function CreateResearchLine() {
  const navigate = useNavigate();
  const [name] = useState(localStorage.getItem("name"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [line, setLine] = useState({ name: "" });
  const [error, setError] = useState(false);

  useEffect(() => {
    const roles = ["Administrator"];
    const token = localStorage.getItem("token");
    try {
      const decoded = jwt_decode(token);
      if (!roles.includes(decoded.role)) {
        navigate("/");
      }
      setRole(decoded.role);
    } catch (error) {
      navigate("/login");
    }
  }, [setRole, navigate, role]);

  const handleSave = (e) => {
    e.preventDefault();
    postResearchLine(line)
      .then(() => navigate(-1))
      .catch(() => setError(true));
  };

  return (
    <PageContainer name={name} isLoading={false}>
      <BackButton />
      {!error ? (
        <form className="form">
          <div className="form-section">
            <div className="formInput">
              <label htmlFor="name">Nome</label>
              <input
                required
                type="text"
                name="name"
                value={line.name}
                onChange={(e) => setLine({ name: e.target.value })}
                id="name"
              />
            </div>
          </div>
          <div className="form-section">
            <div className="formInput">
              <input type="submit" value={"Submit"} onClick={handleSave} />
            </div>
          </div>
        </form>
      ) : (
        <ErrorPage />
      )}
    </PageContainer>
  );
}
