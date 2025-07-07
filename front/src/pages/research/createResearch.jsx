import { useEffect, useState } from "react";
import "../../styles/form.scss";
import { useNavigate, useParams } from "react-router";
import jwt_decode from "jwt-decode";
import Select from "../../components/select";
import BackButton from "../../components/BackButton";
import { getStudentById } from "../../api/student_service";
import { getProjects, getProjectById } from "../../api/project_service";
import { getResearchers } from "../../api/researcher_service";
import InlineError from "../../components/error/InlineError";
import PageContainer from "../../components/PageContainer";
import { postResearch } from "../../api/research_service";

export default function ResearchForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name] = useState(localStorage.getItem("name"));
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [projectOptions, setProjectOptions] = useState([]);
  const [professorOptions, setProfessorOptions] = useState([]);
  const [externalResearchers, setExternalResearchers] = useState([]);
  const [coorientatorOptions, setCoorientatorOptions] = useState([]);
  const [student, setStudent] = useState({});
  const [project, setProject] = useState({});
  const [research, setResearch] = useState({
    dissertation: "",
    studentId: id,
    projectId: "",
    professorId: undefined,
    coorientatorId: undefined,
  });

  const setCoorientator = (id) => {
    setResearch({ ...research, coorientatorId: id });
  };

  const setOrientator = (id) => {
    setResearch({ ...research, professorId: id });
  };

  const handleProjectChange = async (id) => {
    setResearch({ ...research, projectId: id });
    if (!id) {
      setProject(undefined);
      setProfessorOptions([]);
      setCoorientatorOptions([]);
      return;
    }
    try {
      const projectData = await getProjectById(id);
      setProject(projectData);
      const profOpts =
        projectData?.professors?.map((p) => ({
          value: p.id,
          label: `${p.firstName} ${p.lastName}`,
        })) || [];
      setProfessorOptions(profOpts);
      const researcherOptions = externalResearchers.map((r) => ({
        value: r.id,
        label: `${r.firstName} ${r.lastName}`,
      }));
      setCoorientatorOptions([...(profOpts || []), ...researcherOptions]);
    } catch (error) {
      // ignore
    }
  };

  useEffect(() => {
    const fetchStudentAndProject = async () => {
      try {
        setIsLoading(true);
        const student = await getStudentById(id);
        setStudent(student);

        const allProjects = await getProjects();
        const projOptions = (allProjects || []).map((p) => ({
          value: p.id,
          label: p.name,
        }));
        setProjectOptions(projOptions);

        let profOptions = [];
        if (student?.projectId) {
          const projectData = await getProjectById(student.projectId);
          setProject(projectData);
          setResearch((r) => ({ ...r, projectId: student.projectId }));
          profOptions =
            projectData?.professors?.map((p) => ({
              value: p.id,
              label: `${p.firstName} ${p.lastName}`,
            })) || [];
          setProfessorOptions(profOptions);
        } else {
          setProject(undefined);
          setResearch((r) => ({ ...r, projectId: "" }));
          setProfessorOptions([]);
        }

        const researchers = await getResearchers();
        setExternalResearchers(researchers);
        const researcherOptions = researchers.map((r) => ({
          value: r.id,
          label: `${r.firstName} ${r.lastName}`,
        }));
        setCoorientatorOptions([...(profOptions || []), ...researcherOptions]);
        setIsLoading(false);
      } catch (error) {
        setError(true);
        setErrorMessage(error.message);
        setIsLoading(false);
      }
    };

    fetchStudentAndProject();
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
      const body = { ...research };
      await postResearch(body);
      setSuccess(true);
      setTimeout(() => navigate(-1), 1000);
    } catch (err) {
      setError(true);
      setErrorMessage(err?.message || 'Erro ao criar dissertação');
    }
  };

  return (
    <PageContainer name={name} isLoading={isLoading}>
      <BackButton />
      {!error && student && (
        <div className="form">
          <div className="form-section">
              <div className="formInput">
                  <label htmlFor="name">Nome</label>
                  <input type="text" name="name" value={research.dissertation} onChange={(e) => setResearch({...research, dissertation: e.target.value })} id="name" />
              </div>
              <Select
                className="formInput"
                defaultValue={research.projectId || student?.projectId || ""}
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
              defaultValue=""
              onSelect={setOrientator}
              options={[
                { value: "", label: "" },
                ...professorOptions,
              ]}
              label="Orientador"
              name="orientator"
            />
            <Select
              className="formInput"
              defaultValue=""
              onSelect={setCoorientator}
              options={[
                { value: "", label: "" },
                ...coorientatorOptions,
              ]}
              label="Co-Orientador"
              name="coorientator"
            />
          </div>
          <div className="form-section">
            <div className="formInput">
              <input type="submit" value={"Submit"} onClick={handleSave} />
            </div>
          </div>
        </div>
      )}
      {success && <div className="success">Dissertação criada com sucesso</div>}
      {error && <InlineError message={errorMessage} />}
    </PageContainer>
  );
}
