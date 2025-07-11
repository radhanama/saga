import { useEffect, useState } from "react";
import "../../styles/form.scss";
import { useNavigate, useParams } from "react-router";
import jwt_decode from "jwt-decode";
import BackButton from "../../components/BackButton";
import InlineError from "../../components/error/InlineError";
import PageContainer from "../../components/PageContainer";
import { getResearchLines } from "../../api/research_line";
import { putResearchLine } from "../../api/research_line";

export default function UpdateResearchLine() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name] = useState(localStorage.getItem("name"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [line, setLine] = useState({ name: "" });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    getResearchLines()
      .then((result) => {
        const current = result.find((x) => x.id === id);
        if (current) {
          setLine({ name: current.name });
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err?.message || 'Erro ao carregar linha de pesquisa');
        setIsLoading(false);
      });
  }, [id]);

  const handleSave = (e) => {
    e.preventDefault();
    putResearchLine(id, line)
      .then(() => navigate(-1))
      .catch((err) => setError(err?.message || 'Erro ao atualizar linha de pesquisa'));
  };

  return (
    <PageContainer name={name} isLoading={isLoading}>
      <BackButton />
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
              <input type="submit" value={"Update"} onClick={handleSave} />
              <InlineError message={error} />
          </div>
        </div>
      </form>
      <InlineError message={!line && error} />
    </PageContainer>
  );
}
