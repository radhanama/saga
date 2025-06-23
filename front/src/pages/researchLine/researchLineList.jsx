import { useEffect, useState } from "react";
import "../../styles/researchLineList.scss";
import Table from "../../components/Table/table";
import { getResearchLines, deleteResearchLine } from "../../api/research_line";
import { useNavigate } from "react-router";
import jwt_decode from "jwt-decode";
import BackButton from "../../components/BackButton";
import ErrorPage from "../../components/error/Error";
import PageContainer from "../../components/PageContainer";

export default function ResearchLineList() {
  const navigate = useNavigate();
  const [name] = useState(localStorage.getItem("name"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lines, setLines] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [disableNext, setDisableNext] = useState(false);

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
    getResearchLines(page, 10, search)
      .then((result) => {
        let mapped = [];
        if (result !== null && result !== undefined) {
          mapped = result.map((line) => ({
            Id: line.id,
            Nome: line.name,
          }));
        }
        setLines(mapped);
        setDisableNext(result.length < 10);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(true);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadLines();
  }, [page, search]);

  const handleDelete = (id) => {
    deleteResearchLine(id).then(() => loadLines());
  };

  return (
    <PageContainer name={name} isLoading={isLoading}>
      {!error ? (
        <>
          <div className="researchBar">
            <div className="left-bar">
              <div>
                <img src="research.png" alt="A logo representing Research Lines" height={"100rem"} />
              </div>
              <div className="title">Linhas de Pesquisa</div>
            </div>
            {role === 'Administrator' && (
              <div className="right-bar">
                <div className="search">
                  <input type="search" name="search" id="search" value={search} onChange={(e)=>{setPage(1);setSearch(e.target.value)}} />
                </div>
                <div className="create-button">
                  <button onClick={() => navigate('/researchLines/add')}>Nova Linha</button>
                </div>
              </div>
            )}
          </div>
          <BackButton />
          <Table
            data={lines}
            useOptions={role === 'Administrator'}
            page={page}
            setPage={setPage}
            disableNext={disableNext}
            deleteCallback={handleDelete}
            detailsCallback={(id) => navigate(`${id}/edit`)}
          />
        </>
      ) : (
        <ErrorPage />
      )}
    </PageContainer>
  );
}
