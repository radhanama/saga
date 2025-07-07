import { useEffect, useState } from "react";
import "../../styles/form.scss";
import { useNavigate, useParams } from "react-router";
import jwt_decode from "jwt-decode";
import Select from "../../components/select";
import BackButton from "../../components/BackButton";
import { getProjects, getProjectById } from "../../api/project_service";
import { getResearchers } from "../../api/researcher_service";
import InlineError from "../../components/error/InlineError";
import PageContainer from "../../components/PageContainer";
import { getResearchById, putResearch } from "../../api/research_service";

export default function ResearchUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name] = useState(localStorage.getItem("name"));
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [projectOptions, setProjectOptions] = useState([]);
  const [professorOptions, setProfessorOptions] = useState([]);
  const [coorientatorOptions, setCoorientatorOptions] = useState([]);
  const [research, setResearch] = useState({});
  const [project, setProject] = useState();
  const [student, setStudent] = useState();

  const setCoorientator = (id) => {
    setResearch({ ...research, coorientatorId: id });
  };

  const setOrientator = (id) => {
    setResearch({ ...research, professorId: id });
  };

  const handleProjectChange = async (pid) => {
    setResearch({
      ...research,
      projectId: pid,
      professorId: undefined,
      coorientatorId: undefined,
    });
    if (!pid) {
      setProject(undefined);
      setProfessorOptions([]);
      setCoorientatorOptions([]);
      return;
    }
    try {
      const projectData = await getProjectById(pid);
      setProject(projectData);
      const profOpts =
        projectData?.professors?.map((p) => ({
          value: p.id,
          label: `${p.firstName} ${p.lastName}`,
        })) || [];
      setProfessorOptions(profOpts);
      const researchers = await getResearchers();
      const resOpts = researchers.map((r) => ({
        value: r.id,
        label: `${r.firstName} ${r.lastName}`,
      }));
      setCoorientatorOptions([...(profOpts || []), ...resOpts]);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getResearchById(id);
        setResearch({
          dissertation: data.dissertation,
          studentId: data.student.id,
          projectId: data.project?.id,
          professorId: data.professor?.id,
          coorientatorId: data.coorientator?.id,
        });
        setStudent(data.student);

        const allProjects = await getProjects();
        const projOptions = (allProjects || []).map((p) => ({ value: p.id, label: p.name }));
        setProjectOptions(projOptions);

        let profOpts = [];
        if (data.project) {
          const project = await getProjectById(data.project.id);
          setProject(project);
          profOpts = project.professors?.map((p) => ({
            value: p.id,
            label: `${p.firstName} ${p.lastName}`,
          })) || [];
          setProfessorOptions(profOpts);
        } else {
          setProject(undefined);
          setProfessorOptions([]);
        }

        const researchers = await getResearchers();
        const resOpts = researchers.map((r) => ({
          value: r.id,
          label: `${r.firstName} ${r.lastName}`,
        }));
        setCoorientatorOptions([...(profOpts || []), ...resOpts]);
        setIsLoading(false);
      } catch (error) {
        setError(true);
        setErrorMessage(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const roles = ["Administrator"];
    const token = localStorage.getItem("token");
    try {
      const decoded = jwt_decode(token);
      if (!roles.includes(decoded.role)) {
        navigate("/");
      }
    } catch (error) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await putResearch(id, research);
      setSuccess(true);
      setTimeout(() => navigate(-1), 1000);
    } catch (err) {
      setError(true);
      setErrorMessage(err?.message || 'Erro ao atualizar dissertação');
    }
  };

  return (
    <PageContainer name={name} isLoading={isLoading}>
      <BackButton />
      {!error && (
        <div className="form">
          <div className="form-section">
              <div className="formInput">
                  <label htmlFor="name">Nome</label>
                  <input type="text" name="name" value={research.dissertation||''} onChange={(e) => setResearch({...research, dissertation: e.target.value })} id="name" />
              </div>
              <Select
                className="formInput"
                defaultValue={research.projectId || ""}
                onSelect={handleProjectChange}
                options={[{ value: "", label: "" }, ...projectOptions]}
                label="Projeto"
                name="project"
              />
              <div className="formInput">
                  <label htmlFor="student">Estudante</label>
                  <input type="text" name="student" id="student" value={`${student?.firstName ?? ''} ${student?.lastName ?? ''}`} disabled />
              </div>
          </div>
          <div className="form-section">
            <Select
              className="formInput"
              defaultValue={research.professorId || ""}
              onSelect={setOrientator}
              options={[{ value: "", label: "" }, ...(professorOptions||[])]}
              label="Orientador"
              name="orientator"
            />
            <Select
              className="formInput"
              defaultValue={research.coorientatorId || ""}
              onSelect={setCoorientator}
              options={[{ value: "", label: "" }, ...(coorientatorOptions||[])]}
              label="Co-Orientador"
              name="coorientator"
            />
          </div>
          <div className="form-section">
            <div className="formInput">
              <input type="submit" value={"Update"} onClick={handleSave} />
            </div>
          </div>
        </div>
      )}
      {success && <div className="success">Dissertação atualizada com sucesso</div>}
      {error && <InlineError message={errorMessage} />}
    </PageContainer>
  );
}
