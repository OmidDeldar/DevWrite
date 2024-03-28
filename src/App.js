import { useState, useEffect } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import stubs from "./default-stubs";
import "./App.css";

const editorOptions = {
    scrollBeyondLastLine: false,
    fontSize: "14px",
    folding: false,
    // lineDecorationsWidth: 15,
};

const inputOptions = {
    minimap: { enabled: false },
    automaticLayout: true,
    scrollBeyondLastLine: false,
    fontSize: "14px",
    lineDecorationsWidth: 5,
};
const outputOptions = {
    minimap: { enabled: false },
    automaticLayout: true,
    scrollBeyondLastLine: false,
    fontSize: "14px",
    lineDecorationsWidth: 5,
    readOnly: true
};

function App() {
    const [language, setLanguage] = useState("python");
    const [code, setCode] = useState("");
    const [input, setInput] = useState("// input");
    const [output, setOutput] = useState("");
    const [status, setStatus] = useState("");
    const [jobId, setJobId] = useState("");
    const [jobDetails, setJobDetails] = useState(null);
    const [editorMode, setEditorMode] = useState("vs-dark");
    const [languageIcon, setLanguageIcon] = useState("./resources/python.png");
    const [fileName, setFileName] = useState("main.cpp"); // State to hold code file name

    useEffect(() => {
        setCode(stubs[language]);
        setOutput("// output");
        setLanguageIcon(`./resources/${language}.png`);
        if (language === "python") {
            setFileName("main.py");
          } else if (language === "cpp") {
            setFileName("main.cpp");
          } else if (language === "java") {
            setFileName("Main.java");
          } else if (language === "javascript") {
            setFileName("main.js");
          }
    }, [language]);

    const toggleTheme = (idName) => {
        let currentClassName = document.getElementById(idName).className;
        let newClassName = currentClassName;
        if (currentClassName === idName + "-dark")
            newClassName = idName + "-light";
        else newClassName = idName + "-dark";
        document.getElementById(idName).className = newClassName;
    };

    const handleThemeChange = () => {
        if (editorMode === "vs-light") setEditorMode("vs-dark");
        else setEditorMode("vs-light");
        toggleTheme("App");
        toggleTheme("header");
        toggleTheme("app-name");
        toggleTheme("language-button");
        const themeToggler = document.getElementById("theme-icon");
        let classNames = themeToggler.classList;
        if (classNames.contains("theme-icon-light")) {
            classNames.replace("theme-icon-light", "theme-icon-dark");
            classNames.replace("fa-sun", "fa-moon");
        } else {
            classNames.replace("theme-icon-dark", "theme-icon-light");
            classNames.replace("fa-moon", "fa-sun");
        }
    };

    const handleSubmit = async () => {
        const payload = {
            language: language,
            source_code: code,
            input: input,
        };
        try {
            console.log(payload);
            setJobId("");
            setStatus("Running");
            setJobDetails(null);
            setOutput(`Code Execution Status: Running`);
            const { data } = await axios.post(
                "http://127.0.0.1:4600/judge0/create/submission",
                payload
            );
            console.log(data);
            setJobId(data.token);
            if(data.error){
                setOutput(`Code Execution Status: ${data.error}`);
            }

            let intervalId;

            intervalId = setInterval(async () => {
                setStatus("Running");
                setOutput(`Code Execution Status: Running`);
                const { data: dataRes } = await axios.get(
                    "http://127.0.0.1:4600/judge0/get/submission",
                    { params: { token: data.token } }
                );
                const { status, output, error } = dataRes;
                console.log(data)
                console.log(dataRes)
                if (status) {
                    // console.log(dataRes);
                    // setJobDetails(job);
                    // console.log(jobDetails);
                    // const { status: jobStatus, output: jobOutput } = job;
                    setStatus(status);
                    if (status === "Running") {
                        setOutput(`Code Execution Status: Running`);
                        return;
                    } else if (status === "Accepted") {
                        setOutput(
                            `Code Execution Status: ${status}\n\n${output}`
                        );
                    } else {
                        // const errorObject = JSON.parse(output);
                        // console.log(errorObject);
                        setOutput(
                            `Code Execution Status: ${status}\n\n${error}`
                        );
                    }
                    clearInterval(intervalId);
                } else {
                    console.log(dataRes);
                    setStatus("Error !!! ");
                    console.error(error);
                    setOutput(error);
                    clearInterval(intervalId);
                }
            }, 1000);
        } catch ({ response }) {
            if (response) {
                const errorMessage = response.data.err.stderr;
                setOutput(errorMessage);
            } else {
                setOutput("Error connecting to server!");
            }
        }
    };

    // Function to handle saving code
    const handleSave = () => {
        const languageExtensions = {
            python: "py",
            cpp: "cpp",
            java: "java",
            javascript: "js"
        };
        const selectedLanguage = language;
        const fileExtension = languageExtensions[selectedLanguage];
        const fileName = `main.${fileExtension}`; // Constructing the filename
        // const fileName = `code.cpp`; // Constructing the filename
        // Creating a Blob with the code content
        const blob = new Blob([code], { type: "text/plain" });
    
        // Creating a temporary URL for the Blob
        const url = URL.createObjectURL(blob);
    
        // Creating an anchor element
        const link = document.createElement("a");
    
        // Setting properties of the anchor element
        link.href = url;
        link.download = fileName; // Setting the download attribute to specify filename
    
        // Programmatically triggering the click event on the anchor element
        link.click();
    
        // Cleanup: removing the anchor element and revoking the URL
        URL.revokeObjectURL(url);
        alert("Code saved successfully!");
    };

    return (
        <div id="App" className="App-dark">
            <div id="header" className="header-dark">
                <h3 id="app-name" className="app-name-dark">
                    <i className="fas fa-solid fa-code" aria-hidden="true"></i>
                    &nbsp; DevWrite
                </h3>

                <div className="nav-right-options">
                    <i
                        id="theme-icon"
                        className="fas fa-solid fa-sun fa-2x nav-icons theme-icon-light"
                        aria-hidden="true"
                        onClick={handleThemeChange}
                    ></i>

                    <i
                        className="fas fa-solid fa-bug tutorial-icon nav-icons fa-2x"
                        aria-hidden="true"
                    ></i>
                </div>
            </div>
            <div className="file-name-container"> {/* New container div */}
            <span className="file-name">{fileName}</span> {/* New span element */}
            <div className="secondary-nav-items">
            {/* Save button */}
            <button className="btn save-btn" onClick={handleSave}>
                <i className="fas fa-save fa-fade save-icon" aria-hidden="true"></i>
                &nbsp; Save
            </button>
                <button className="btn logo-btn" disabled={true}>
                    <img
                        src={require(`${languageIcon}`)}
                        className="image"
                        alt={`${language} icon`}
                    />
                </button>
                <button id="language-button" className="language-button-dark">
                    <select
                        value={language}
                        onChange={(e) => {
                            setStatus("");
                            setJobDetails(null);
                            setLanguage(e.target.value);
                            setCode(stubs[e.target.value]);
                            setLanguageIcon(`./resources/${language}.png`);
                        }}
                    >
                        <option value={"python"}>Python</option>
                        <option value={"cpp"}>C++</option>
                        <option value={"java"}>Java</option>
                        <option value={"javascript"}>Javascript</option>
                    </select>
                </button>
                {/* run button */}
                <button className="btn run-btn" onClick={handleSubmit} >
                    <i
                        className="fas fa-play fa-fade run-icon"
                        aria-hidden="true"
                    ></i>
                    &nbsp; Run
                </button>
            </div>
            </div>
            <div className="editor">
                <Editor
                    height="100%"
                    width="100%"
                    theme={editorMode}
                    defaultLanguage={language}
                    defaultValue={code}
                    value={code}
                    onChange={(e) => setCode(e)}
                    options={editorOptions}
                    language={language}
                />
            </div>
            <div className="std-input-output">
                <div className="std-input">
                    <Editor
                        height="100%"
                        width="100%"
                        theme={editorMode}
                        defaultLanguage="plaintext"
                        defaultValue={"// input"}
                        value={input}
                        options={inputOptions}
                        onChange={(e) => setInput(e)}
                    />
                </div>
                <div className="std-output">
                    <Editor
                        height="100%"
                        width="100%"
                        theme={editorMode}
                        defaultLanguage="plaintext"
                        defaultValue={"// output"}
                        value={output}
                        options={outputOptions}
                    />
                </div>
            </div>
            <br />
        </div>
    );
}

export default App;
