
export const syllabusData = [
    // =========================================================================
    // ENGINEERING & TECHNOLOGY
    // =========================================================================
    {
        id: "jee-main",
        name: "JEE Main",
        category: "Engineering",
        duration: "3 Hours",
        questions: "90 Questions (Answer 75)",
        marking: "+4 for correct, -1 for incorrect, 0 for unattempted",
        pattern: [
            { subject: "Physics", q: "30 (20 MCQs + 10 Numericals)", note: "Attempt 5 Numericals" },
            { subject: "Chemistry", q: "30 (20 MCQs + 10 Numericals)", note: "Attempt 5 Numericals" },
            { subject: "Mathematics", q: "30 (20 MCQs + 10 Numericals)", note: "Attempt 5 Numericals" }
        ],
        syllabus: {
            "Physics": [
                { name: "Units and Measurements", weight: "Low", difficulty: "Easy" },
                { name: "Kinematics", weight: "Medium", difficulty: "Easy" },
                { name: "Laws of Motion", weight: "High", difficulty: "Medium" },
                { name: "Work, Energy and Power", weight: "High", difficulty: "Easy" },
                { name: "Rotational Motion", weight: "High", difficulty: "Hard" },
                { name: "Gravitation", weight: "Medium", difficulty: "Easy" },
                { name: "Properties of Solids and Liquids", weight: "Medium", difficulty: "Medium" },
                { name: "Thermodynamics", weight: "High", difficulty: "Medium" },
                { name: "Kinetic Theory of Gases", weight: "Low", difficulty: "Easy" },
                { name: "Oscillations and Waves", weight: "Medium", difficulty: "Hard" },
                { name: "Electrostatics", weight: "High", difficulty: "Medium" },
                { name: "Current Electricity", weight: "High", difficulty: "Easy" },
                { name: "Magnetic Effects of Current and Magnetism", weight: "High", difficulty: "Medium" },
                { name: "Electromagnetic Induction and AC", weight: "Medium", difficulty: "Medium" },
                { name: "Electromagnetic Waves", weight: "Low", difficulty: "Easy" },
                { name: "Optics", weight: "High", difficulty: "Hard" },
                { name: "Dual Nature of Matter and Radiation", weight: "Medium", difficulty: "Easy" },
                { name: "Atoms and Nuclei", weight: "Medium", difficulty: "Easy" },
                { name: "Electronic Devices", weight: "Medium", difficulty: "Easy" }
            ],
            "Chemistry": [
                { name: "Some Basic Concepts in Chemistry", weight: "Low", difficulty: "Easy" },
                { name: "Atomic Structure", weight: "Medium", difficulty: "Medium" },
                { name: "Chemical Bonding and Molecular Structure", weight: "High", difficulty: "Hard" },
                { name: "Chemical Thermodynamics", weight: "Medium", difficulty: "Hard" },
                { name: "Solutions", weight: "Medium", difficulty: "Medium" },
                { name: "Equilibrium", weight: "High", difficulty: "Hard" },
                { name: "Redox Reactions and Electrochemistry", weight: "High", difficulty: "Medium" },
                { name: "Chemical Kinetics", weight: "Medium", difficulty: "Medium" },
                { name: "Surface Chemistry", weight: "Low", difficulty: "Easy" },
                { name: "Classification of Elements and Periodicity", weight: "Medium", difficulty: "Easy" },
                { name: "p-Block Elements", weight: "High", difficulty: "Medium" },
                { name: "d- and f- Block Elements", weight: "Medium", difficulty: "Easy" },
                { name: "Coordination Compounds", weight: "High", difficulty: "Hard" },
                { name: "Purification and Characterisation of Organic Compounds", weight: "Low", difficulty: "Medium" },
                { name: "Some Basic Principles of Organic Chemistry", weight: "High", difficulty: "Hard" },
                { name: "Hydrocarbons", weight: "High", difficulty: "Medium" },
                { name: "Organic Compounds Containing Halogens", weight: "Medium", difficulty: "Medium" },
                { name: "Organic Compounds Containing Oxygen", weight: "High", difficulty: "Hard" },
                { name: "Organic Compounds Containing Nitrogen", weight: "Medium", difficulty: "Medium" },
                { name: "Biomolecules", weight: "Medium", difficulty: "Easy" }
            ],
            "Mathematics": [
                { name: "Sets, Relations and Functions", weight: "Medium", difficulty: "Easy" },
                { name: "Complex Numbers and Quadratic Equations", weight: "High", difficulty: "Medium" },
                { name: "Matrices and Determinants", weight: "High", difficulty: "Easy" },
                { name: "Permutations and Combinations", weight: "Medium", difficulty: "Hard" },
                { name: "Binomial Theorem", weight: "B", difficulty: "Medium" },
                { name: "Sequence and Series", weight: "Medium", difficulty: "Medium" },
                { name: "Limit, Continuity and Differentiability", weight: "High", difficulty: "Medium" },
                { name: "Integral Calculus", weight: "High", difficulty: "Hard" },
                { name: "Differential Equations", weight: "Medium", difficulty: "Medium" },
                { name: "Coordinate Geometry", weight: "High", difficulty: "Hard" },
                { name: "Three Dimensional Geometry", weight: "High", difficulty: "Medium" },
                { name: "Vector Algebra", weight: "Medium", difficulty: "Easy" },
                { name: "Statistics and Probability", weight: "High", difficulty: "Medium" },
                { name: "Trigonometry", weight: "Low", difficulty: "Medium" }
            ]
        }
    },
    {
        id: "jee-advanced",
        name: "JEE Advanced",
        category: "Engineering",
        duration: "6 Hours (Paper 1 & 2)",
        questions: "Variable (Changes every year)",
        marking: "Variable (Includes partial marking)",
        pattern: [
            { subject: "Physics", q: "Variable", note: "MCQs, Numerical, Comprehension, Matching" },
            { subject: "Chemistry", q: "Variable", note: "MCQs, Numerical, Comprehension, Matching" },
            { subject: "Mathematics", q: "Variable", note: "MCQs, Numerical, Comprehension, Matching" }
        ],
        syllabus: {
            "Physics": [
                { name: "General Physics", weight: "Medium", difficulty: "Hard" },
                { name: "Mechanics", weight: "High", difficulty: "Hard" },
                { name: "Thermal Physics", weight: "Medium", difficulty: "Medium" },
                { name: "Electricity and Magnetism", weight: "High", difficulty: "Hard" },
                { name: "Optics", weight: "Medium", difficulty: "Hard" },
                { name: "Modern Physics", weight: "Medium", difficulty: "Medium" }
            ],
            "Chemistry": [
                { name: "Gaseous and Liquid States", weight: "Medium", difficulty: "Medium" },
                { name: "Atomic Structure and Chemical Bonding", weight: "High", difficulty: "Hard" },
                { name: "Energetics and Thermodynamics", weight: "High", difficulty: "Hard" },
                { name: "Chemical Equilibrium", weight: "Medium", difficulty: "Medium" },
                { name: "Electrochemistry", weight: "High", difficulty: "Hard" },
                { name: "Chemical Kinetics", weight: "Medium", difficulty: "Medium" },
                { name: "Solid State", weight: "Low", difficulty: "Easy" },
                { name: "Solutions", weight: "Medium", difficulty: "Medium" },
                { name: "Surface Chemistry", weight: "Low", difficulty: "Easy" },
                { name: "Transition Elements", weight: "Medium", difficulty: "Medium" },
                { name: "Ores and Minerals", weight: "Low", difficulty: "Easy" },
                { name: "Extractive Metallurgy", weight: "Medium", difficulty: "Medium" },
                { name: "Principles of Qualitative Analysis", weight: "Medium", difficulty: "Hard" },
                { name: "Preparation, Properties and Reactions of Alkanes, Alkenes, Alkynes", weight: "High", difficulty: "Medium" },
                { name: "Reactions of Benzene", weight: "Medium", difficulty: "Medium" },
                { name: "Phenols", weight: "Medium", difficulty: "Medium" },
                { name: "Carbohydrates", weight: "Medium", difficulty: "Easy" },
                { name: "Amino Acids and Peptides", weight: "Medium", difficulty: "Medium" },
                { name: "Polymers", weight: "Low", difficulty: "Easy" }
            ],
            "Mathematics": [
                { name: "Algebra", weight: "High", difficulty: "Hard" },
                { name: "Logarithms and their properties", weight: "Low", difficulty: "Easy" },
                { name: "Trigonometry", weight: "Medium", difficulty: "Medium" },
                { name: "Matrices", weight: "Medium", difficulty: "Medium" },
                { name: "Probability", weight: "High", difficulty: "Hard" },
                { name: "Analytical Geometry (2D and 3D)", weight: "High", difficulty: "Hard" },
                { name: "Differential Calculus", weight: "High", difficulty: "Hard" },
                { name: "Integral Calculus", weight: "High", difficulty: "Hard" },
                { name: "Vectors", weight: "Medium", difficulty: "Medium" }
            ]
        }
    },
    {
        id: "bitsat",
        name: "BITSAT",
        category: "Engineering",
        duration: "3 Hours",
        questions: "130 Questions",
        marking: "+3 for correct, -1 for incorrect",
        pattern: [
            { subject: "Physics", q: "30", note: "" },
            { subject: "Chemistry", q: "30", note: "" },
            { subject: "English & Logical Reasoning", q: "10 (Eng) + 20 (LR)", note: "" },
            { subject: "Mathematics", q: "40", note: "" }
        ],
        syllabus: {
            "Physics": [
                { name: "Units & Measurement", weight: "Low", difficulty: "Easy" },
                { name: "Kinematics", weight: "Medium", difficulty: "Medium" },
                { name: "Newton's Laws of Motion", weight: "High", difficulty: "Medium" },
                { name: "Impulse and Momentum", weight: "Medium", difficulty: "Medium" },
                { name: "Work and Energy", weight: "Medium", difficulty: "Easy" },
                { name: "Rotational Motion", weight: "High", difficulty: "Hard" },
                { name: "Gravitation", weight: "Medium", difficulty: "Easy" },
                { name: "Mechanics of Solids and Fluids", weight: "Medium", difficulty: "Medium" },
                { name: "Oscillations", weight: "Medium", difficulty: "Medium" },
                { name: "Waves", weight: "Medium", difficulty: "Medium" },
                { name: "Heat and Thermodynamics", weight: "High", difficulty: "Medium" },
                { name: "Electrostatics", weight: "High", difficulty: "Medium" },
                { name: "Current Electricity", weight: "High", difficulty: "Easy" },
                { name: "Magnetic Effect of Current", weight: "High", difficulty: "Medium" },
                { name: "Electromagnetic Induction", weight: "Medium", difficulty: "Medium" },
                { name: "Optics", weight: "High", difficulty: "Hard" },
                { name: "Modern Physics", weight: "Medium", difficulty: "Easy" },
                { name: "Electronic Devices", weight: "Low", difficulty: "Easy" }
            ],
            "Chemistry": [
                { name: "States of Matter", weight: "Medium", difficulty: "Easy" },
                { name: "Atomic Structure", weight: "Medium", difficulty: "Medium" },
                { name: "Chemical Thermodynamics", weight: "Medium", difficulty: "Hard" },
                { name: "Chemical Equilibrium", weight: "Medium", difficulty: "Medium" },
                { name: "Electrochemistry", weight: "Medium", difficulty: "Medium" },
                { name: "Chemical Kinetics", weight: "Medium", difficulty: "Medium" },
                { name: "Hydrogen and s-block elements", weight: "Medium", difficulty: "Easy" },
                { name: "p- d- and f-block elements", weight: "High", difficulty: "Medium" },
                { name: "Principles of Organic Chemistry", weight: "High", difficulty: "Medium" },
                { name: "Hydrocarbons", weight: "High", difficulty: "Medium" },
                { name: "Stereochemistry", weight: "Medium", difficulty: "Hard" },
                { name: "Organic Compounds with Functional Groups", weight: "High", difficulty: "Hard" },
                { name: "Biological Macromolecules", weight: "Medium", difficulty: "Medium" }
            ],
            "Mathematics": [
                { name: "Algebra", weight: "High", difficulty: "Medium" },
                { name: "Trigonometry", weight: "Medium", difficulty: "Easy" },
                { name: "Two-dimensional Coordinate Geometry", weight: "High", difficulty: "Hard" },
                { name: "Three-dimensional Coordinate Geometry", weight: "Medium", difficulty: "Medium" },
                { name: "Differential Calculus", weight: "High", difficulty: "Hard" },
                { name: "Integral Calculus", weight: "High", difficulty: "Hard" },
                { name: "Ordinary Differential Equations", weight: "Medium", difficulty: "Medium" },
                { name: "Probability", weight: "High", difficulty: "Hard" },
                { name: "Vectors", weight: "Medium", difficulty: "Easy" },
                { name: "Statistics", weight: "Low", difficulty: "Easy" },
                { name: "Linear Programming", weight: "Low", difficulty: "Easy" }
            ],
            "English Proficiency": [
                { name: "Grammar", weight: "Medium", difficulty: "Easy" },
                { name: "Vocabulary", weight: "High", difficulty: "Medium" },
                { name: "Reading Comprehension", weight: "High", difficulty: "Medium" },
                { name: "Composition", weight: "Low", difficulty: "Easy" }
            ],
            "Logical Reasoning": [
                { name: "Verbal Reasoning", weight: "Medium", difficulty: "Easy" },
                { name: "Non-verbal Reasoning", weight: "Medium", difficulty: "Medium" }
            ]
        }
    },
    {
        id: "viteee",
        name: "VITEEE",
        category: "Engineering",
        duration: "2 Hours 30 Minutes",
        questions: "125 Questions",
        marking: "+1 for correct, No Negative Marking",
        pattern: [
            { subject: "Mathematics", q: "40", note: "" },
            { subject: "Physics", q: "35", note: "" },
            { subject: "Chemistry", q: "35", note: "" },
            { subject: "Aptitude", q: "10", note: "" },
            { subject: "English", q: "5", note: "" }
        ],
        syllabus: {
            "Mathematics": [
                { name: "Matrices and their Applications", weight: "Medium", difficulty: "Easy" },
                { name: "Trigonometry and Complex Numbers", weight: "Medium", difficulty: "Medium" },
                { name: "Analytical Geometry of two dimensions", weight: "High", difficulty: "Medium" },
                { name: "Vector Algebra", weight: "High", difficulty: "Medium" },
                { name: "Analytical Geometry of Three Dimensions", weight: "Medium", difficulty: "Medium" },
                { name: "Differential Calculus", weight: "High", difficulty: "Hard" },
                { name: "Integral Calculus", weight: "High", difficulty: "Hard" },
                { name: "Differential Equations", weight: "Medium", difficulty: "Medium" },
                { name: "Probability Distributions", weight: "Medium", difficulty: "Medium" },
                { name: "Discrete Mathematics", weight: "Low", difficulty: "Easy" }
            ],
            "Physics": [
                { name: "Laws of Motion & Work, Energy and Power", weight: "High", difficulty: "Medium" },
                { name: "Properties of Matter", weight: "Medium", difficulty: "Easy" },
                { name: "Electrostatics", weight: "High", difficulty: "Medium" },
                { name: "Current Electricity", weight: "High", difficulty: "Easy" },
                { name: "Magnetic Effects of Electric Current", weight: "Medium", difficulty: "Medium" },
                { name: "Electromagnetic Induction and Alternating Current", weight: "Medium", difficulty: "Hard" },
                { name: "Optics", weight: "Medium", difficulty: "Medium" },
                { name: "Nuclear Physics", weight: "Medium", difficulty: "Easy" },
                { name: "Dual Nature of Radiation and Atomic Physics", weight: "Medium", difficulty: "Easy" },
                { name: "Semiconductor Devices and their Applications", weight: "Low", difficulty: "Easy" }
            ],
            "Chemistry": [
                { name: "Atomic Structure", weight: "Medium", difficulty: "Medium" },
                { name: "p, d and f – Block Elements", weight: "High", difficulty: "Medium" },
                { name: "Coordination Chemistry and Solid State Chemistry", weight: "Medium", difficulty: "Hard" },
                { name: "Thermodynamics, Chemical Equilibrium and Chemical Kinetics", weight: "High", difficulty: "Hard" },
                { name: "Electrochemistry", weight: "Medium", difficulty: "Medium" },
                { name: "Isomerism in Organic Compounds", weight: "Medium", difficulty: "Medium" },
                { name: "Alcohols and Ethers", weight: "Medium", difficulty: "Easy" },
                { name: "Carbonyl Compounds", weight: "High", difficulty: "Hard" },
                { name: "Carboxylic Acids and their derivatives", weight: "Medium", difficulty: "Medium" },
                { name: "Organic Nitrogen Compounds and Biomolecules", weight: "Medium", difficulty: "Easy" }
            ]
        }
    },
    {
        id: "srmjeee",
        name: "SRMJEEE",
        category: "Engineering",
        duration: "2 Hours 30 Minutes",
        questions: "125 Questions",
        marking: "+1 for correct, No Negative Marking",
        pattern: [
            { subject: "Physics", q: "35", note: "" },
            { subject: "Chemistry", q: "35", note: "" },
            { subject: "Mathematics", q: "40", note: "" },
            { subject: "English", q: "5", note: "" },
            { subject: "Aptitude", q: "10", note: "" }
        ],
        syllabus: {
            "Physics": [
                { name: "Units and Measurement", weight: "Low", difficulty: "Easy" },
                { name: "Mechanics", weight: "High", difficulty: "Medium" },
                { name: "Gravitation, Mechanics of Solids and Fluids", weight: "Medium", difficulty: "Medium" },
                { name: "Oscillations and Wave Motion", weight: "Medium", difficulty: "Medium" },
                { name: "Heat and Thermodynamics", weight: "Medium", difficulty: "Medium" },
                { name: "Ray and Wave Optics", weight: "High", difficulty: "Hard" },
                { name: "Electricity and Magnetism", weight: "High", difficulty: "Medium" },
                { name: "Modern Physics", weight: "Medium", difficulty: "Easy" }
            ],
            "Chemistry": [
                { name: "Chemical Families: Periodic Properties", weight: "Medium", difficulty: "Easy" },
                { name: "Atomic Structure", weight: "Medium", difficulty: "Medium" },
                { name: "Chemical Bonding", weight: "High", difficulty: "Medium" },
                { name: "Chemical Energetics", weight: "Medium", difficulty: "Hard" },
                { name: "Chemical Kinetics", weight: "Medium", difficulty: "Medium" },
                { name: "Electrochemistry", weight: "Medium", difficulty: "Medium" },
                { name: "Surface Chemistry, Chemical Equilibrium and Solutions", weight: "Medium", difficulty: "Medium" },
                { name: "Hydrocarbons", weight: "High", difficulty: "Hard" },
                { name: "Organic Compounds with Oxygen and Nitrogen", weight: "High", difficulty: "Hard" },
                { name: "Polymers and Biomolecules", weight: "Low", difficulty: "Easy" }
            ],
            "Mathematics": [
                { name: "Sets, Relations and Functions", weight: "Low", difficulty: "Easy" },
                { name: "Complex Numbers", weight: "Medium", difficulty: "Medium" },
                { name: "Matrices and Determinants", weight: "Medium", difficulty: "Easy" },
                { name: "Applications of Matrices and Determinants", weight: "Medium", difficulty: "Medium" },
                { name: "Differential Calculus", weight: "High", difficulty: "Hard" },
                { name: "Integral Calculus", weight: "High", difficulty: "Hard" },
                { name: "Differential Equations", weight: "Medium", difficulty: "Medium" },
                { name: "Straight Lines and Pair of Straight Lines", weight: "Medium", difficulty: "Medium" },
                { name: "Circle", weight: "Medium", difficulty: "Medium" },
                { name: "Conic Sections", weight: "Medium", difficulty: "Hard" },
                { name: "Vector Algebra", weight: "Medium", difficulty: "Easy" }
            ]
        }
    },
    {
        id: "tnea",
        name: "TNEA",
        category: "Engineering",
        duration: "N/A (Admission via 12th Marks)",
        questions: "N/A",
        marking: "Cutoff Calculation: (Maths) + (Physics/2) + (Chem/2)",
        pattern: [
            { subject: "Mathematics", q: "100 Marks", note: "Core Weightage" },
            { subject: "Physics", q: "100 Marks", note: "Scaled to 50" },
            { subject: "Chemistry", q: "100 Marks", note: "Scaled to 50" }
        ],
        syllabus: {
            "Note": [{ name: "Based on Tamil Nadu State Board Class 12 Syllabus", weight: "Full", difficulty: "Medium" }]
        }
    },

    // =========================================================================
    // MEDICAL & HEALTH
    // =========================================================================
    {
        id: "neet-ug",
        name: "NEET UG",
        category: "Medical",
        duration: "3 Hours 20 Minutes",
        questions: "200 Questions (Attempt 180)",
        marking: "+4 for correct, -1 for incorrect",
        pattern: [
            { subject: "Physics", q: "50 (35 Sec A + 15 Sec B)", note: "Attempt 10 in Sec B" },
            { subject: "Chemistry", q: "50 (35 Sec A + 15 Sec B)", note: "Attempt 10 in Sec B" },
            { subject: "Botany", q: "50 (35 Sec A + 15 Sec B)", note: "Attempt 10 in Sec B" },
            { subject: "Zoology", q: "50 (35 Sec A + 15 Sec B)", note: "Attempt 10 in Sec B" }
        ],
        syllabus: {
            "Physics": [
                { name: "Physical World and Measurement", weight: "Low", difficulty: "Easy" },
                { name: "Kinematics", weight: "Medium", difficulty: "Medium" },
                { name: "Laws of Motion", weight: "High", difficulty: "Medium" },
                { name: "Work, Energy and Power", weight: "Medium", difficulty: "Easy" },
                { name: "Motion of System of Particles and Rigid Body", weight: "Medium", difficulty: "Hard" },
                { name: "Gravitation", weight: "Medium", difficulty: "Easy" },
                { name: "Properties of Bulk Matter", weight: "Medium", difficulty: "Medium" },
                { name: "Thermodynamics", weight: "High", difficulty: "Medium" },
                { name: "Behaviour of Perfect Gas and Kinetic Theory", weight: "Low", difficulty: "Easy" },
                { name: "Oscillations and Waves", weight: "Medium", difficulty: "Hard" },
                { name: "Electrostatics", weight: "High", difficulty: "Medium" },
                { name: "Current Electricity", weight: "High", difficulty: "Easy" },
                { name: "Magnetic Effects of Current and Magnetism", weight: "High", difficulty: "Medium" },
                { name: "Electromagnetic Induction and Alternating Currents", weight: "Medium", difficulty: "Medium" },
                { name: "Electromagnetic Waves", weight: "Low", difficulty: "Easy" },
                { name: "Optics", weight: "High", difficulty: "Hard" },
                { name: "Dual Nature of Matter and Radiation", weight: "Medium", difficulty: "Easy" },
                { name: "Atoms and Nuclei", weight: "Medium", difficulty: "Easy" },
                { name: "Electronic Devices", weight: "Medium", difficulty: "Easy" }
            ],
            "Chemistry": [
                { name: "Some Basic Concepts of Chemistry", weight: "Low", difficulty: "Easy" },
                { name: "Structure of Atom", weight: "Medium", difficulty: "Medium" },
                { name: "Classification of Elements and Periodicity", weight: "Medium", difficulty: "Easy" },
                { name: "Chemical Bonding and Molecular Structure", weight: "High", difficulty: "Hard" },
                { name: "States of Matter", weight: "Medium", difficulty: "Easy" },
                { name: "Thermodynamics", weight: "High", difficulty: "Medium" },
                { name: "Equilibrium", weight: "High", difficulty: "Hard" },
                { name: "Redox Reactions", weight: "Medium", difficulty: "Easy" },
                { name: "Hydrogen", weight: "Low", difficulty: "Easy" },
                { name: "s-Block Element", weight: "Medium", difficulty: "Easy" },
                { name: "Some p-Block Elements", weight: "Medium", difficulty: "Medium" },
                { name: "Organic Chemistry- Some Basic Principles", weight: "High", difficulty: "Hard" },
                { name: "Hydrocarbons", weight: "High", difficulty: "Medium" },
                { name: "Environmental Chemistry", weight: "Low", difficulty: "Easy" }
            ],
            "Biology": [
                { name: "Diversity in Living World", weight: "High", difficulty: "Medium" },
                { name: "Structural Organisation in Animals and Plants", weight: "Medium", difficulty: "Easy" },
                { name: "Cell Structure and Function", weight: "High", difficulty: "Medium" },
                { name: "Plant Physiology", weight: "High", difficulty: "Hard" },
                { name: "Human Physiology", weight: "High", difficulty: "Medium" },
                { name: "Reproduction", weight: "Medium", difficulty: "Easy" },
                { name: "Genetics and Evolution", weight: "High", difficulty: "Hard" },
                { name: "Biology and Human Welfare", weight: "Medium", difficulty: "Easy" },
                { name: "Biotechnology and Its Applications", weight: "Medium", difficulty: "Medium" },
                { name: "Ecology and Environment", weight: "High", difficulty: "Easy" }
            ]
        }
    },
    {
        id: "allied-health",
        name: "Allied Health (TN)",
        category: "Medical",
        duration: "N/A (Merit Based)",
        questions: "N/A",
        marking: "Based on 12th Board Marks",
        pattern: [{ subject: "Science Subjects", q: "Aggregate", note: "Physics, Chemistry, Biology marks considered" }],
        syllabus: {
            "Note": [{ name: "TN State Board / CBSE Class 12 Syllabus", weight: "Full", difficulty: "Medium" }]
        }
    },

    // =========================================================================
    // LAW
    // =========================================================================
    {
        id: "clat-ug",
        name: "CLAT UG",
        category: "Law",
        duration: "2 Hours",
        questions: "120 Questions",
        marking: "+1 for correct, -0.25 for incorrect",
        pattern: [
            { subject: "English Language", q: "22-26", note: "" },
            { subject: "Current Affairs & GK", q: "28-32", note: "" },
            { subject: "Legal Reasoning", q: "28-32", note: "" },
            { subject: "Logical Reasoning", q: "22-26", note: "" },
            { subject: "Quantitative Techniques", q: "10-14", note: "" }
        ],
        syllabus: {
            "Legal Reasoning": [
                { name: "Law of Torts", weight: "High", difficulty: "Medium" },
                { name: "Law of Contracts", weight: "High", difficulty: "Medium" },
                { name: "Criminal Law", weight: "Medium", difficulty: "Medium" },
                { name: "Constitutional Law", weight: "High", difficulty: "Hard" },
                { name: "Legal Maxims", weight: "Low", difficulty: "Easy" }
            ],
            "Current Affairs": [
                { name: "National News", weight: "High", difficulty: "Easy" },
                { name: "International Events", weight: "Medium", difficulty: "Medium" },
                { name: "Legal News", weight: "Medium", difficulty: "Medium" },
                { name: "Awards and Honors", weight: "Low", difficulty: "Easy" }
            ],
            "English": [
                { name: "Reading Comprehension", weight: "High", difficulty: "Medium" },
                { name: "Vocabulary", weight: "Medium", difficulty: "Easy" },
                { name: "Grammar", weight: "Medium", difficulty: "Easy" }
            ],
            "Logical Reasoning": [
                { name: "Critical Reasoning", weight: "High", difficulty: "Hard" },
                { name: "Analytical Reasoning", weight: "Medium", difficulty: "Medium" },
                { name: "Syllogisms", weight: "Low", difficulty: "Medium" }
            ],
            "Quantitative Techniques": [
                { name: "Arithmetic", weight: "High", difficulty: "Medium" },
                { name: "Data Interpretation", weight: "High", difficulty: "Hard" },
                { name: "Modern Maths", weight: "Medium", difficulty: "Medium" }
            ]
        }
    },
    {
        id: "ailet",
        name: "AILET",
        category: "Law",
        duration: "1 Hour 30 Minutes",
        questions: "150 Questions",
        marking: "+1 for correct, -0.25 for incorrect",
        pattern: [
            { subject: "English", q: "50", note: "" },
            { subject: "Current Affairs & GK", q: "30", note: "" },
            { subject: "Logical Reasoning", q: "70", note: "Includes Legal Reasoning" }
        ],
        syllabus: {
            "English": [
                { name: "Reading Comprehension", weight: "High", difficulty: "Medium" },
                { name: "Grammar", weight: "Medium", difficulty: "Easy" },
                { name: "Vocabulary", weight: "Medium", difficulty: "Easy" }
            ],
            "GK": [
                { name: "Static GK", weight: "Medium", difficulty: "Hard" },
                { name: "Current Events", weight: "High", difficulty: "Easy" }
            ],
            "Logical Reasoning": [
                { name: "Legal Principles", weight: "High", difficulty: "Medium" },
                { name: "Logical Deductions", weight: "High", difficulty: "Hard" },
                { name: "Verbal Reasoning", weight: "Medium", difficulty: "Medium" }
            ]
        }
    },
    {
        id: "lsat-india",
        name: "LSAT India",
        category: "Law",
        duration: "2 Hours 20 Minutes",
        questions: "92 Questions",
        marking: "No Negative Marking, Scaled Score",
        pattern: [
            { subject: "Analytical Reasoning", q: "23", note: "" },
            { subject: "Logical Reasoning (1)", q: "22", note: "" },
            { subject: "Logical Reasoning (2)", q: "23", note: "" },
            { subject: "Reading Comprehension", q: "24", note: "" }
        ],
        syllabus: {
            "Analytical Reasoning": [
                { name: "Ordering/Sequencing", weight: "High", difficulty: "Hard" },
                { name: "Grouping/Selection", weight: "High", difficulty: "Medium" }
            ],
            "Logical Reasoning": [
                { name: "Argument Analysis", weight: "High", difficulty: "Medium" },
                { name: "Inference", weight: "Medium", difficulty: "Hard" },
                { name: "Flaws in Reasoning", weight: "Medium", difficulty: "Medium" }
            ]
        }
    },

    // =========================================================================
    // MANAGEMENT
    // =========================================================================
    {
        id: "cuet-ug",
        name: "CUET UG",
        category: "Management",
        duration: "Slot Based",
        questions: "40/50 per Domain Subject",
        marking: "+5 for correct, -1 for incorrect",
        pattern: [
            { subject: "Language", q: "40/50", note: "Section IA & IB" },
            { subject: "Domain Specific", q: "40/50", note: "Section II (Max 6 subjects)" },
            { subject: "General Test", q: "50/60", note: "Section III" }
        ],
        syllabus: {
            "General Test": [
                { name: "General Knowledge", weight: "Medium", difficulty: "Easy" },
                { name: "Numerical Ability", weight: "High", difficulty: "Medium" },
                { name: "Reasoning", weight: "High", difficulty: "Medium" },
                { name: "Mental Ability", weight: "Medium", difficulty: "Easy" }
            ],
            "Domain": [{ name: "Subject Specific (Based on 12th NCERT Syllabus)", weight: "Full", difficulty: "Medium" }]
        }
    },
    {
        id: "ipmat",
        name: "IPMAT",
        category: "Management",
        duration: "2 Hours",
        questions: "90 Questions",
        marking: "+4 for correct, -1 for incorrect",
        pattern: [
            { subject: "Quant (MCQ)", q: "30", note: "" },
            { subject: "Quant (SA)", q: "15", note: "No Negative Marking" },
            { subject: "Verbal Ability", q: "45", note: "" }
        ],
        syllabus: {
            "Quantitative Ability": [
                { name: "Number System", weight: "Medium", difficulty: "Easy" },
                { name: "Arithmetic", weight: "High", difficulty: "Medium" },
                { name: "Algebra", weight: "Medium", difficulty: "Hard" },
                { name: "Geometry", weight: "Medium", difficulty: "Medium" },
                { name: "Data Interpretation", weight: "Medium", difficulty: "Medium" }
            ],
            "Verbal Ability": [
                { name: "Vocabulary", weight: "Medium", difficulty: "Easy" },
                { name: "Grammar Usage", weight: "Medium", difficulty: "Medium" },
                { name: "Reading Comprehension", weight: "High", difficulty: "Medium" },
                { name: "Parajumbles", weight: "High", difficulty: "Hard" }
            ]
        }
    },
    {
        id: "ugat",
        name: "UGAT",
        category: "Management",
        duration: "2 Hours",
        questions: "130 Questions",
        marking: "+1 for correct, No negative",
        pattern: [
            { subject: "English", q: "40", note: "" },
            { subject: "Numerical & Data Analysis", q: "30", note: "" },
            { subject: "Reasoning & Intelligence", q: "30", note: "" },
            { subject: "General Knowledge", q: "30", note: "" }
        ],
        syllabus: {
            "English": [{ name: "Vocabulary", weight: "Medium", difficulty: "Easy" }, { name: "Grammar", weight: "Medium", difficulty: "Easy" }],
            "Reasoning": [{ name: "Visual Reasoning", weight: "High", difficulty: "Medium" }, { name: "Series & Analogies", weight: "Medium", difficulty: "Easy" }]
        }
    },

    // =========================================================================
    // PROFESSIONAL COURSES
    // =========================================================================
    {
        id: "ca-foundation",
        name: "CA Foundation",
        category: "Commerce",
        duration: "4 Papers",
        questions: "Subjective + Objective",
        marking: "-0.25 for Objective Papers (3 & 4)",
        pattern: [
            { subject: "Accounting", q: "100 Marks", note: "Subj" },
            { subject: "Business Laws", q: "100 Marks", note: "Subj" },
            { subject: "Quant Aptitude", q: "100 Marks", note: "Obj" },
            { subject: "Business Economics", q: "100 Marks", note: "Obj" }
        ],
        syllabus: {
            "Accounting": [
                { name: "Theoretical Framework", weight: "Low", difficulty: "Easy" },
                { name: "Accounting Process", weight: "Medium", difficulty: "Easy" },
                { name: "Bank Reconciliation Statement", weight: "Medium", difficulty: "Medium" },
                { name: "Inventories", weight: "Medium", difficulty: "Medium" },
                { name: "Final Accounts", weight: "High", difficulty: "Medium" },
                { name: "Partnership Accounts", weight: "High", difficulty: "Hard" }
            ],
            "Law": [
                { name: "Indian Contract Act, 1872", weight: "High", difficulty: "Hard" },
                { name: "Sale of Goods Act, 1930", weight: "Medium", difficulty: "Medium" },
                { name: "Indian Partnership Act, 1932", weight: "Medium", difficulty: "Easy" },
                { name: "The Companies Act, 2013", weight: "Medium", difficulty: "Medium" }
            ],
            "Maths": [
                { name: "Ratio and Proportion", weight: "Low", difficulty: "Easy" },
                { name: "Time Value of Money", weight: "High", difficulty: "Easy" },
                { name: "Logical Reasoning", weight: "Medium", difficulty: "Medium" },
                { name: "Statistics", weight: "High", difficulty: "Medium" }
            ]
        }
    },
    {
        id: "cs-foundation",
        name: "CS Executive Entrance (CSEET)",
        category: "Commerce",
        duration: "2 Hours",
        questions: "140 Questions",
        marking: "No Negative Marking",
        pattern: [
            { subject: "Business Comm.", q: "35 Q / 50 Marks", note: "" },
            { subject: "Legal Aptitude", q: "35 Q / 50 Marks", note: "" },
            { subject: "Economic Envr.", q: "35 Q / 50 Marks", note: "" },
            { subject: "Current Affairs", q: "35 Q / 50 Marks", note: "" }
        ],
        syllabus: {
            "Legal Aptitude": [{ name: "Constitution of India", weight: "High", difficulty: "Medium" }, { name: "Mercantile Laws", weight: "Medium", difficulty: "Medium" }],
            "Business Comm": [{ name: "Essentials of Good English", weight: "High", difficulty: "Easy" }, { name: "Business Correspondence", weight: "High", difficulty: "Easy" }]
        }
    },
    {
        id: "cma-foundation",
        name: "CMA Foundation",
        category: "Commerce",
        duration: "2 Hours",
        questions: "100 MCQ",
        marking: "No Negative Marking",
        pattern: [
            { subject: "Economics & Mgmt", q: "50 Q", note: "" },
            { subject: "Accounting", q: "50 Q", note: "" },
            { subject: "Laws & Ethics", q: "50 Q", note: "" },
            { subject: "Business Maths", q: "50 Q", note: "" }
        ],
        syllabus: {
            "Economics": [{ name: "Basic Concepts", weight: "Medium", difficulty: "Easy" }, { name: "Forms of Market", weight: "High", difficulty: "Medium" }],
            "Accounting": [{ name: "Accounting Basics", weight: "Medium", difficulty: "Easy" }, { name: "Cost Accounting", weight: "High", difficulty: "Medium" }]
        }
    },

    // =========================================================================
    // DESIGN & ARCHITECTURE
    // =========================================================================
    {
        id: "nata",
        name: "NATA",
        category: "Architecture",
        duration: "3 Hours",
        questions: "125 Marks",
        marking: "No Negative Marking",
        pattern: [
            { subject: "Drawing", q: "2 Q / 80 Marks", note: "" },
            { subject: "Aptitude (MCQ)", q: "120 Marks", note: "Maths, GK, Logic" }
        ],
        syllabus: {
            "Aptitude": [
                { name: "Visual Spatial Perception", weight: "High", difficulty: "Medium" },
                { name: "Building Materials and Construction", weight: "Medium", difficulty: "Easy" },
                { name: "Mental Ability", weight: "Medium", difficulty: "Medium" }
            ],
            "Drawing": [
                { name: "Perspective Drawing", weight: "High", difficulty: "Hard" },
                { name: "Sketching", weight: "Medium", difficulty: "Medium" }
            ]
        }
    },
    {
        id: "uceed",
        name: "UCEED",
        category: "Design",
        duration: "3 Hours",
        questions: "Part A + Part B",
        marking: "Part A (Negative Marking), Part B (Subj)",
        pattern: [
            { subject: "Part A", q: "240 Marks", note: "NAT, MSQ, MCQ" },
            { subject: "Part B", q: "60 Marks", note: "Drawing" }
        ],
        syllabus: {
            "Part A": [
                { name: "Visualization and Spatial Ability", weight: "High", difficulty: "Hard" },
                { name: "Observation and Design Sensitivity", weight: "High", difficulty: "Medium" },
                { name: "Environmental and Social Awareness", weight: "Medium", difficulty: "Easy" },
                { name: "Analytical and Logical Reasoning", weight: "Medium", difficulty: "Medium" }
            ],
            "Part B": [{ name: "Drawing and Sketching", weight: "High", difficulty: "Hard" }]
        }
    },

    // =========================================================================
    // READ ONLY (NOT ELIGIBLE)
    // =========================================================================
    {
        id: "nda",
        name: "NDA",
        category: "Defense",
        duration: "2.5 + 2.5 Hours",
        questions: "Math (120) + GAT (150)",
        marking: "Negative Marking Exists",
        pattern: [{ subject: "Mathematics", q: "120" }, { subject: "GAT", q: "150" }],
        syllabus: { "Note": [{ name: "Age Limit: 16.5 - 19.5 Years", weight: "Info", difficulty: "Info" }] },
        readOnly: true
    },
    {
        id: "ssc",
        name: "SSC / TNPSC",
        category: "Govt Jobs",
        duration: "Variable",
        questions: "Variable",
        marking: "Variable",
        pattern: [{ subject: "General Studies", q: "Var" }, { subject: "Aptitude", q: "Var" }],
        syllabus: { "Note": [{ name: "Graduation Required", weight: "Info", difficulty: "Info" }] },
        readOnly: true
    }
];
