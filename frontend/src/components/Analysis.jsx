function Analysis({ analysis }) {

    return (

        <div className="card">

            <h2>📊 AI Analysis</h2>

            <p>

                <strong>Document Type:</strong>

                {" "}

                {analysis.document_type}

            </p>

            <p>

                <strong>Summary:</strong>

                {" "}

                {analysis.summary}

            </p>

            <hr />

            <h3>💻 Skills</h3>

            <ul>

                {analysis.skills &&
                    analysis.skills.map((skill, index) => (

                        <li key={index}>{skill}</li>

                    ))}

            </ul>

            <h3>🚀 Projects</h3>

            <ul>

                {analysis.projects &&
                    analysis.projects.map((project, index) => (

                        <li key={index}>

                            <strong>

                                {project.title}

                            </strong>

                            <br />

                            {project.description}

                        </li>

                    ))}

            </ul>

            <h3>📜 Certifications</h3>

            <ul>

                {analysis.certifications &&
                    analysis.certifications.map((item, index) => (

                        <li key={index}>{item}</li>

                    ))}

            </ul>

            <h3>🏆 Achievements</h3>

            <ul>

                {analysis.achievements &&
                    analysis.achievements.map((item, index) => (

                        <li key={index}>{item}</li>

                    ))}

            </ul>

        </div>

    );

}

export default Analysis;