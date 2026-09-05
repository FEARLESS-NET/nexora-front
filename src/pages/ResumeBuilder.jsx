import { useState, useRef } from "react";
import { ArrowLeft, Download, FileText, Sparkles, Eye, CheckCircle, Terminal, Code2 } from "lucide-react";
import { Link } from "react-router-dom";
import html2pdf from "html2pdf.js";

const ResumeBuilder = () => {
  const [activeTab, setActiveTab] = useState("builder");
  const [showTips, setShowTips] = useState(false);
  const resumeRef = useRef(null);

  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    website: "",

    // Professional Summary
    summary: "",

    // Experience
    experience: [
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        description: ""
      }
    ],

    // Education
    education: [
      {
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        current: false
      }
    ],

    // Skills
    skills: "",

    // Projects
    projects: [
      {
        name: "",
        description: "",
        technologies: "",
        link: ""
      }
    ]
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, subField, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) =>
        i === index ? { ...item, [subField]: value } : item
      )
    }));
  };

  const addArrayItem = (field) => {
    const newItem = field === "experience" 
      ? { company: "", position: "", startDate: "", endDate: "", current: false, description: "" }
      : field === "education"
      ? { institution: "", degree: "", field: "", startDate: "", endDate: "", current: false }
      : { name: "", description: "", technologies: "", link: "" };

    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], newItem]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const generatePDF = () => {
    const element = resumeRef.current;
    const opt = {
      margin: 0,
      filename: `${formData.fullName || 'resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const resumeTips = [
    {
      category: "Personal Information",
      tips: [
        "Use a professional email address (firstname.lastname@gmail.com)",
        "Include your LinkedIn profile URL",
        "Add your GitHub or portfolio link for developers",
        "Location should be city, state/country"
      ]
    },
    {
      category: "Professional Summary",
      tips: [
        "Keep it concise (2-3 sentences)",
        "Highlight your key skills and experience",
        "Tailor it to the job you're applying for",
        "Include years of experience and key achievements"
      ]
    },
    {
      category: "Work Experience",
      tips: [
        "List experience in reverse chronological order",
        "Use action verbs (Developed, Implemented, Led)",
        "Quantify achievements when possible (Increased sales by 25%)",
        "Focus on relevant experience for the position"
      ]
    },
    {
      category: "Education",
      tips: [
        "Include degree, institution, and graduation date",
        "Add relevant coursework or projects",
        "Include GPA if it's above 3.5",
        "List certifications separately if you have many"
      ]
    },
    {
      category: "Skills",
      tips: [
        "Separate technical and soft skills",
        "Include programming languages, frameworks, tools",
        "Be honest about your skill level",
        "Match skills to job requirements"
      ]
    },
    {
      category: "Projects",
      tips: [
        "Showcase your best 2-3 projects",
        "Include technologies used",
        "Describe your role and contributions",
        "Add links to live demos or GitHub repositories"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d18] via-[#081525] to-[#050d18] cyber-grid px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 animate-slide-in">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-green-400 font-mono"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-green-400">$</span> back
          </Link>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/30 animate-pulse-glow">
                  <FileText className="h-5 w-5 text-green-400" />
                </div>
                <h1 className="text-3xl font-bold sm:text-4xl font-mono text-glow">
                  Resume Builder
                </h1>
              </div>
              <p className="mt-2 text-gray-400 font-mono text-sm">
                <span className="text-green-400">$</span> Create a professional resume in minutes
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowTips(!showTips)}
                className={`btn-cyber flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold font-mono ${
                  showTips 
                    ? "bg-green-500/20 border-green-500/50 text-green-400 animate-pulse-glow"
                    : "bg-white/5 border-white/10 text-gray-300 hover:border-green-500/30"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                Tips
              </button>
              <button
                onClick={() => setActiveTab(activeTab === "builder" ? "preview" : "builder")}
                className={`btn-cyber flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold font-mono ${
                  activeTab === "preview"
                    ? "bg-green-500/20 border-green-500/50 text-green-400 animate-pulse-glow"
                    : "bg-white/5 border-white/10 text-gray-300 hover:border-green-500/30"
                }`}
              >
                <Eye className="h-4 w-4" />
                {activeTab === "builder" ? "Preview" : "Edit"}
              </button>
              <button
                onClick={generatePDF}
                className="btn-cyber flex items-center gap-2 rounded-xl bg-green-500/20 border border-green-500/50 px-4 py-2 text-sm font-semibold text-green-400 hover:bg-green-500/30 animate-pulse-glow"
              >
                <Download className="h-4 w-4" />
                <span className="font-mono">Download PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tips Panel */}
        {showTips && (
          <div className="glass-cyber mb-8 rounded-2xl border border-green-500/20 p-6 animate-slide-in">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 font-mono">
              <Sparkles className="h-5 w-5 text-green-400" />
              <span className="text-green-400">$</span> Resume Writing Tips
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {resumeTips.map((section, index) => (
                <div key={index} className="code-block rounded-xl p-4">
                  <h3 className="font-semibold text-green-400 mb-2 font-mono text-sm">
                    <Terminal className="inline-block h-4 w-4 mr-1" />
                    {section.category}
                  </h3>
                  <ul className="space-y-2">
                    {section.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-2 text-sm text-gray-400 font-mono text-xs">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form Section */}
          {activeTab === "builder" && (
            <div className="space-y-6">
              {/* Personal Information */}
              <section className="glass-cyber rounded-2xl border border-green-500/20 p-6 animate-slide-in" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 font-mono">
                  <FileText className="h-5 w-5 text-green-400" />
                  <span className="text-green-400">$</span> Personal Information
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1 font-mono text-xs">Full Name *</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="input-cyber w-full rounded-xl px-4 py-2.5 text-white placeholder-gray-500 font-mono text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1 font-mono text-xs">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="input-cyber w-full rounded-xl px-4 py-2.5 text-white placeholder-gray-500 font-mono text-sm"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1 font-mono text-xs">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="input-cyber w-full rounded-xl px-4 py-2.5 text-white placeholder-gray-500 font-mono text-sm"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1 font-mono text-xs">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="input-cyber w-full rounded-xl px-4 py-2.5 text-white placeholder-gray-500 font-mono text-sm"
                      placeholder="New York, NY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1 font-mono text-xs">LinkedIn</label>
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => handleInputChange("linkedin", e.target.value)}
                      className="input-cyber w-full rounded-xl px-4 py-2.5 text-white placeholder-gray-500 font-mono text-sm"
                      placeholder="linkedin.com/in/johndoe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1 font-mono text-xs">GitHub</label>
                    <input
                      type="url"
                      value={formData.github}
                      onChange={(e) => handleInputChange("github", e.target.value)}
                      className="input-cyber w-full rounded-xl px-4 py-2.5 text-white placeholder-gray-500 font-mono text-sm"
                      placeholder="github.com/johndoe"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-1 font-mono text-xs">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      className="input-cyber w-full rounded-xl px-4 py-2.5 text-white placeholder-gray-500 font-mono text-sm"
                      placeholder="johndoe.com"
                    />
                  </div>
                </div>
              </section>

              {/* Professional Summary */}
              <section className="glass-cyber rounded-2xl border border-green-500/20 p-6 animate-slide-in" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-xl font-semibold mb-4 font-mono">
                  <span className="text-green-400">$</span> Professional Summary
                </h2>
                <textarea
                  value={formData.summary}
                  onChange={(e) => handleInputChange("summary", e.target.value)}
                  rows={4}
                  className="input-cyber w-full rounded-xl px-4 py-2.5 text-white placeholder-gray-500 resize-none font-mono text-sm"
                  placeholder="Experienced software developer with 5+ years of experience in building web applications..."
                />
              </section>

              {/* Experience */}
              <section className="glass-cyber rounded-2xl border border-green-500/20 p-6 animate-slide-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold font-mono">
                    <span className="text-green-400">$</span> Work Experience
                  </h2>
                  <button
                    onClick={() => addArrayItem("experience")}
                    className="btn-cyber text-sm text-green-400 font-mono px-3 py-1 rounded-lg"
                  >
                    + Add Experience
                  </button>
                </div>
                {formData.experience.map((exp, index) => (
                  <div key={index} className="code-block mb-4 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold font-mono text-sm text-green-400">
                        <Terminal className="inline-block h-4 w-4 mr-1" />
                        Experience {index + 1}
                      </h3>
                      {formData.experience.length > 1 && (
                        <button
                          onClick={() => removeArrayItem("experience", index)}
                          className="text-sm text-red-400 hover:text-red-300 font-mono"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1 font-mono text-xs">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleArrayChange("experience", index, "company", e.target.value)}
                          className="input-cyber w-full rounded-lg px-3 py-2 text-white placeholder-gray-500 font-mono text-sm"
                          placeholder="Company Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1 font-mono text-xs">Position</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => handleArrayChange("experience", index, "position", e.target.value)}
                          className="input-cyber w-full rounded-lg px-3 py-2 text-white placeholder-gray-500 font-mono text-sm"
                          placeholder="Job Title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1 font-mono text-xs">Start Date</label>
                        <input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => handleArrayChange("experience", index, "startDate", e.target.value)}
                          className="input-cyber w-full rounded-lg px-3 py-2 text-white placeholder-gray-500 font-mono text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1 font-mono text-xs">End Date</label>
                        <input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => handleArrayChange("experience", index, "endDate", e.target.value)}
                          disabled={exp.current}
                          className="input-cyber w-full rounded-lg px-3 py-2 text-white placeholder-gray-500 font-mono text-sm disabled:opacity-50"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="flex items-center gap-2 text-sm text-gray-400 font-mono text-xs">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => handleArrayChange("experience", index, "current", e.target.checked)}
                            className="rounded border-green-500/30 bg-green-500/10 text-green-500 focus:ring-green-500"
                          />
                          Currently working here
                        </label>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-400 mb-1 font-mono text-xs">Description</label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => handleArrayChange("experience", index, "description", e.target.value)}
                          rows={3}
                          className="input-cyber w-full rounded-lg px-3 py-2 text-white placeholder-gray-500 resize-none font-mono text-sm"
                          placeholder="Describe your responsibilities and achievements..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              {/* Education */}
              <section className="glass-cyber rounded-2xl border border-green-500/20 p-6 animate-slide-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold font-mono">
                    <span className="text-green-400">$</span> Education
                  </h2>
                  <button
                    onClick={() => addArrayItem("education")}
                    className="btn-cyber text-sm text-green-400 font-mono px-3 py-1 rounded-lg"
                  >
                    + Add Education
                  </button>
                </div>
                {formData.education.map((edu, index) => (
                  <div key={index} className="code-block mb-4 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold font-mono text-sm text-green-400">
                        <Terminal className="inline-block h-4 w-4 mr-1" />
                        Education {index + 1}
                      </h3>
                      {formData.education.length > 1 && (
                        <button
                          onClick={() => removeArrayItem("education", index)}
                          className="text-sm text-red-400 hover:text-red-300 font-mono"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1 font-mono text-xs">Institution</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => handleArrayChange("education", index, "institution", e.target.value)}
                          className="input-cyber w-full rounded-lg px-3 py-2 text-white placeholder-gray-500 font-mono text-sm"
                          placeholder="University Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1 font-mono text-xs">Degree</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleArrayChange("education", index, "degree", e.target.value)}
                          className="input-cyber w-full rounded-lg px-3 py-2 text-white placeholder-gray-500 font-mono text-sm"
                          placeholder="Bachelor's, Master's, etc."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1 font-mono text-xs">Field of Study</label>
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) => handleArrayChange("education", index, "field", e.target.value)}
                          className="input-cyber w-full rounded-lg px-3 py-2 text-white placeholder-gray-500 font-mono text-sm"
                          placeholder="Computer Science"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1 font-mono text-xs">Start Date</label>
                        <input
                          type="month"
                          value={edu.startDate}
                          onChange={(e) => handleArrayChange("education", index, "startDate", e.target.value)}
                          className="input-cyber w-full rounded-lg px-3 py-2 text-white placeholder-gray-500 font-mono text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1 font-mono text-xs">End Date</label>
                        <input
                          type="month"
                          value={edu.endDate}
                          onChange={(e) => handleArrayChange("education", index, "endDate", e.target.value)}
                          disabled={edu.current}
                          className="input-cyber w-full rounded-lg px-3 py-2 text-white placeholder-gray-500 font-mono text-sm disabled:opacity-50"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="flex items-center gap-2 text-sm text-gray-400 font-mono text-xs">
                          <input
                            type="checkbox"
                            checked={edu.current}
                            onChange={(e) => handleArrayChange("education", index, "current", e.target.checked)}
                            className="rounded border-green-500/30 bg-green-500/10 text-green-500 focus:ring-green-500"
                          />
                          Currently studying here
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              {/* Skills */}
              <section className="glass-cyber rounded-2xl border border-green-500/20 p-6 animate-slide-in" style={{ animationDelay: '0.5s' }}>
                <h2 className="text-xl font-semibold mb-4 font-mono">
                  <span className="text-green-400">$</span> Skills
                </h2>
                <textarea
                  value={formData.skills}
                  onChange={(e) => handleInputChange("skills", e.target.value)}
                  rows={4}
                  className="input-cyber w-full rounded-xl px-4 py-2.5 text-white placeholder-gray-500 resize-none font-mono text-sm"
                  placeholder="JavaScript, React, Node.js, Python, AWS, Docker..."
                />
                <p className="mt-2 text-xs text-gray-500 font-mono"><span className="text-green-400">#</span> Separate skills with commas</p>
              </section>

              {/* Projects */}
              <section className="glass-cyber rounded-2xl border border-green-500/20 p-6 animate-slide-in" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold font-mono">
                    <span className="text-green-400">$</span> Projects
                  </h2>
                  <button
                    onClick={() => addArrayItem("projects")}
                    className="btn-cyber text-sm text-green-400 font-mono px-3 py-1 rounded-lg"
                  >
                    + Add Project
                  </button>
                </div>
                {formData.projects.map((project, index) => (
                  <div key={index} className="code-block mb-4 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold font-mono text-sm text-green-400">
                        <Code2 className="inline-block h-4 w-4 mr-1" />
                        Project {index + 1}
                      </h3>
                      {formData.projects.length > 1 && (
                        <button
                          onClick={() => removeArrayItem("projects", index)}
                          className="text-sm text-red-400 hover:text-red-300 font-mono"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1 font-mono text-xs">Project Name</label>
                        <input
                          type="text"
                          value={project.name}
                          onChange={(e) => handleArrayChange("projects", index, "name", e.target.value)}
                          className="input-cyber w-full rounded-lg px-3 py-2 text-white placeholder-gray-500 font-mono text-sm"
                          placeholder="My Awesome Project"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1 font-mono text-xs">Description</label>
                        <textarea
                          value={project.description}
                          onChange={(e) => handleArrayChange("projects", index, "description", e.target.value)}
                          rows={2}
                          className="input-cyber w-full rounded-lg px-3 py-2 text-white placeholder-gray-500 resize-none font-mono text-sm"
                          placeholder="Brief description of the project..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1 font-mono text-xs">Technologies</label>
                        <input
                          type="text"
                          value={project.technologies}
                          onChange={(e) => handleArrayChange("projects", index, "technologies", e.target.value)}
                          className="input-cyber w-full rounded-lg px-3 py-2 text-white placeholder-gray-500 font-mono text-sm"
                          placeholder="React, Node.js, MongoDB"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1 font-mono text-xs">Project Link</label>
                        <input
                          type="url"
                          value={project.link}
                          onChange={(e) => handleArrayChange("projects", index, "link", e.target.value)}
                          className="input-cyber w-full rounded-lg px-3 py-2 text-white placeholder-gray-500 font-mono text-sm"
                          placeholder="https://github.com/username/project"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            </div>
          )}

          {/* Preview Section */}
          {activeTab === "preview" && (
            <div className="lg:col-span-2">
              <div className="glass-cyber rounded-2xl border border-green-500/20 p-8 overflow-auto max-h-[80vh] animate-slide-in">
                <div ref={resumeRef} className="text-gray-900 bg-white">
                  {/* Resume Preview Content */}
                  <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="border-b-2 border-gray-900 pb-4 mb-6">
                      <h1 className="text-3xl font-bold text-gray-900">{formData.fullName || "Your Name"}</h1>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                        {formData.email && <span>{formData.email}</span>}
                        {formData.phone && <span>{formData.phone}</span>}
                        {formData.location && <span>{formData.location}</span>}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                        {formData.linkedin && <a href={formData.linkedin} className="text-blue-600">LinkedIn</a>}
                        {formData.github && <a href={formData.github} className="text-blue-600">GitHub</a>}
                        {formData.website && <a href={formData.website} className="text-blue-600">Website</a>}
                      </div>
                    </div>

                    {/* Summary */}
                    {formData.summary && (
                      <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">Professional Summary</h2>
                        <p className="text-sm text-gray-700">{formData.summary}</p>
                      </div>
                    )}

                    {/* Experience */}
                    {formData.experience.some(exp => exp.company || exp.position) && (
                      <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Work Experience</h2>
                        {formData.experience.map((exp, index) => (
                          (exp.company || exp.position) && (
                            <div key={index} className="mb-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                                  <p className="text-sm text-gray-700">{exp.company}</p>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                                  {exp.startDate && (exp.endDate || exp.current) && " - "}
                                  {exp.current ? "Present" : exp.endDate && new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                                </div>
                              </div>
                              {exp.description && (
                                <p className="mt-2 text-sm text-gray-700">{exp.description}</p>
                              )}
                            </div>
                          )
                        ))}
                      </div>
                    )}

                    {/* Education */}
                    {formData.education.some(edu => edu.institution || edu.degree) && (
                      <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Education</h2>
                        {formData.education.map((edu, index) => (
                          (edu.institution || edu.degree) && (
                            <div key={index} className="mb-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                                  <p className="text-sm text-gray-700">{edu.institution}</p>
                                  {edu.field && <p className="text-sm text-gray-600">{edu.field}</p>}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {edu.startDate && new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                                  {edu.startDate && (edu.endDate || edu.current) && " - "}
                                  {edu.current ? "Present" : edu.endDate && new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                                </div>
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    )}

                    {/* Skills */}
                    {formData.skills && (
                      <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Skills</h2>
                        <p className="text-sm text-gray-700">{formData.skills}</p>
                      </div>
                    )}

                    {/* Projects */}
                    {formData.projects.some(proj => proj.name) && (
                      <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Projects</h2>
                        {formData.projects.map((project, index) => (
                          project.name && (
                            <div key={index} className="mb-3">
                              <h3 className="font-semibold text-gray-900">{project.name}</h3>
                              {project.description && (
                                <p className="mt-1 text-sm text-gray-700">{project.description}</p>
                              )}
                              {project.technologies && (
                                <p className="mt-1 text-sm text-gray-600"><strong>Technologies:</strong> {project.technologies}</p>
                              )}
                              {project.link && (
                                <a href={project.link} className="text-sm text-blue-600">{project.link}</a>
                              )}
                            </div>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;