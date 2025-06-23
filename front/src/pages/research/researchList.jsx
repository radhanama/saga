import { useEffect, useState } from "react";
import "../../styles/researchList.scss";
import Table from "../../components/Table/table";
import Pagination from "../../components/Pagination/Pagination";
import { getResearch } from "../../api/research_service";
import { useNavigate } from "react-router";
import jwt_decode from "jwt-decode";
import BackButton from "../../components/BackButton";
import InlineError from "../../components/error/InlineError";
import PageContainer from "../../components/PageContainer";

export default function ResearchList() {
  const navigate = useNavigate();
  const [name] = useState(localStorage.getItem("name"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [researches, setResearches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const roles = ["Administrator", "Professor"];
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
    getResearch()
      .then((result) => {
        let mapped = [];
        if (result !== null && result !== undefined) {
          mapped = result.map((research) => {
            return {
              Id: research.id,
              Nome: research.dissertation,
              Orientador: `${research.professor?.firstName} ${research.professor?.lastName}`,
              Coorientador: research.coorientator ? `${research.coorientator?.firstName} ${research.coorientator?.lastName}` : '',
              Estudante: `${research.student?.firstName} ${research.student?.lastName}`,
            };
          });
        }
        setResearches(mapped);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(true);
        setErrorMessage(error?.message || 'Erro ao carregar dissertações');
        setIsLoading(false);
      });
  }, [setResearches, setIsLoading]);

  return (
    <PageContainer name={name} isLoading={isLoading}>
      {!error ? (
        <>
          <div className="researchBar">
            <div className="left-bar">
              <div>
                <img
                  src="research.png"
                  alt="A logo representing Researches"
                  height={"100rem"}
                />
              </div>
              <div className="title">Dissertações</div>
            </div>
          </div>
          <BackButton />
          <Table data={researches} page={currentPage} itemsPerPage={itemsPerPage} useOptions={role === 'Administrator'} detailsCallback={(id)=>navigate(`${id}/edit`)} />
          <Pagination currentPage={currentPage} totalPages={Math.ceil(researches.length/itemsPerPage)} onPageChange={setCurrentPage} />
        </>
      ) : (
        <InlineError message={errorMessage} />
      )}
    </PageContainer>
  );
}
