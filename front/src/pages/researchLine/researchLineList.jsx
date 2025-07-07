import { useEffect, useState } from "react";
import "../../styles/researchLineList.scss";
import Table from "../../components/Table/table";
import Pagination from "../../components/Pagination/Pagination";
import { getResearchLines, deleteResearchLine } from "../../api/research_line";
import { useNavigate } from "react-router";
import jwt_decode from "jwt-decode";
import BackButton from "../../components/BackButton";
import ErrorPage from "../../components/error/Error";
import PageContainer from "../../components/PageContainer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSitemap } from '@fortawesome/free-solid-svg-icons';

export default function ResearchLineList() {
  const navigate = useNavigate();
  const [name] = useState(localStorage.getItem("name"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lines, setLines] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const roles = ["Administrator", "Student", "Professor"];
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

  const loadLines = () => {
    setIsLoading(true);
    getResearchLines()
      .then((result) => {
        let mapped = [];
        if (result !== null && result !== undefined) {
          mapped = result.map((line) => ({
            Id: line.id,
            Nome: line.name,
          }));
        }
        setLines(mapped);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(true);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadLines();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Tem certeza que deseja deletar?')) return;
    deleteResearchLine(id).then(() => loadLines());
  };

  return (
    <PageContainer name={name} isLoading={isLoading}>
      {!error ? (
        <>
          <div className="researchBar">
            <div className="left-bar">
              <div>
                <FontAwesomeIcon icon={faSitemap} />
              </div>
              <div className="title">Linhas de Pesquisa</div>
            </div>
            {role === 'Administrator' && (
              <div className="right-bar">
                <div className="create-button">
                  <button onClick={() => navigate('/researchLines/add')}>Nova Linha</button>
                </div>
              </div>
            )}
          </div>
          <BackButton />
          <Table
            data={lines}
            page={currentPage}
            itemsPerPage={itemsPerPage}
            useOptions={role === 'Administrator'}
          deleteCallback={handleDelete}
          editCallback={(id) => navigate(`${id}/edit`)}
          detailsCallback={(id) => navigate(`${id}/edit`)}
        />
          <Pagination currentPage={currentPage} totalPages={Math.ceil(lines.length/itemsPerPage)} onPageChange={setCurrentPage} />
        </>
      ) : (
        <ErrorPage />
      )}
    </PageContainer>
  );
}
