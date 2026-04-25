// src/services/mockAI.js

export const ocrService = {
  extractText: async (file) => {
    // Simulate OCR delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    return `ORDER OF REJECTION
    Case No: 452/SCH/2024
    The application for 'Post-Matric Scholarship' submitted by Aksaar Patel is hereby REJECTED.
    Reason: Discrepancy in Income Certificate. The declared annual income does not match the supporting documents.
    Missing: Updated Domicile Certificate for 2024.
    Authority: Department of Social Justice and Empowerment.`;
  }
};

export const nlpService = {
  analyzeRejection: (text) => {
    // Basic extraction logic
    const reason = text.includes('Income Certificate') ? 'Discrepancy in Income Certificate' : 'General rejection';
    const missingDocs = text.includes('Domicile') ? ['Updated Domicile Certificate (2024)'] : [];
    const authority = 'Department of Social Justice and Empowerment';
    
    return { reason, missingDocs, authority };
  },
  
  generateAppealLetter: (data) => {
    const { name, reason, authority } = data;
    return `To,
The Commissioner,
${authority},
New Delhi.

Date: ${new Date().toLocaleDateString()}

Subject: Appeal against rejection of application (Case No: 452/SCH/2024)

Respected Sir/Madam,

I am writing to formally appeal the rejection of my scholarship application. The reason cited was "${reason}". I would like to clarify that I have now obtained the corrected documentation and wish to submit the same for your reconsideration.

I request you to kindly review my application and allow me to submit the missing documents.

Yours faithfully,
${name || 'Applicant'}
Contact: +91 9876543210`;
  }
};

export const ruleEngine = {
  schemes: [
    {
      id: "pm-kisan",
      name: "PM-KISAN Samman Nidhi",
      ministry: "Ministry of Agriculture",
      benefit_inr: 6000,
      benefit_text: "₹6,000 per year direct to bank (3 installments of ₹2,000)",
      tagline: "Income support for landholding farmer families",
      eligibility: {
        occupations: ["farmer"],
        max_income: 1000000,
        min_age: 18,
      },
      apply_url: "https://pmkisan.gov.in",
      docs_required: ["Aadhaar", "Land record", "Bank passbook"],
    },
    {
      id: "nsp-scholarship",
      name: "National Scholarship (Post-Matric)",
      ministry: "Ministry of Education / Social Justice",
      benefit_inr: 20000,
      benefit_text: "Up to ₹20,000 per year + tuition fee reimbursement",
      tagline: "Scholarship for students from low-income families",
      eligibility: {
        occupations: ["student"],
        max_income: 250000,
        min_age: 16,
        max_age: 30,
      },
      apply_url: "https://scholarships.gov.in",
      docs_required: ["Aadhaar", "Income certificate", "Marksheet (last passed)", "Bank passbook", "Caste certificate (if applicable)", "Domicile certificate"],
    },
    {
      id: "pmkvy",
      name: "PM Kaushal Vikas Yojana (PMKVY)",
      ministry: "Ministry of Skill Development",
      benefit_inr: 8000,
      benefit_text: "Free skill training + ₹8,000 stipend on completion",
      tagline: "Free skill development & certification for youth",
      eligibility: {
        occupations: ["unemployed", "student", "worker"],
        min_age: 15,
        max_age: 45,
      },
      apply_url: "https://www.pmkvyofficial.org",
      docs_required: ["Aadhaar", "Bank passbook", "Photo", "Education certificate"],
    },
    {
      id: "pmegp",
      name: "PMEGP (MSME Loan)",
      ministry: "Ministry of MSME / KVIC",
      benefit_inr: 2500000,
      benefit_text: "Up to ₹25 lakh loan for manufacturing / ₹10 lakh for services with 15-35% subsidy",
      tagline: "Self-employment loan to start your own business",
      eligibility: {
        occupations: ["self-employed", "unemployed", "entrepreneur"],
        min_age: 18,
      },
      apply_url: "https://www.kviconline.gov.in/pmegpeportal",
      docs_required: ["Aadhaar", "PAN card", "Project report", "Bank passbook", "Photo", "Address proof"],
    },
    {
      id: "pmay",
      name: "PM Awas Yojana (Urban)",
      ministry: "Ministry of Housing & Urban Affairs",
      benefit_inr: 250000,
      benefit_text: "Up to ₹2.5 lakh interest subsidy for first home purchase",
      tagline: "Housing-for-all subsidy for first-time home buyers",
      eligibility: {
        max_income: 1800000,
        min_age: 18,
      },
      apply_url: "https://pmaymis.gov.in",
      docs_required: ["Aadhaar", "Income certificate", "Bank passbook", "Property documents", "Photo"],
    },
    {
      id: "ayushman",
      name: "Ayushman Bharat (PMJAY)",
      ministry: "Ministry of Health",
      benefit_inr: 500000,
      benefit_text: "₹5 lakh free health insurance per family per year",
      tagline: "Free hospitalization cover for low-income families",
      eligibility: {
        max_income: 250000,
      },
      apply_url: "https://pmjay.gov.in",
      docs_required: ["Aadhaar", "Ration card", "Income certificate"],
    },
    {
      id: "atal-pension",
      name: "Atal Pension Yojana",
      ministry: "Ministry of Finance",
      benefit_inr: 60000,
      benefit_text: "Guaranteed ₹1,000 to ₹5,000 monthly pension after age 60",
      tagline: "Government-guaranteed pension for unorganized workers",
      eligibility: {
        min_age: 18,
        max_age: 40,
      },
      apply_url: "https://www.npscra.nsdl.co.in/scheme-details.php",
      docs_required: ["Aadhaar", "Bank passbook", "Mobile number"],
    },
    {
      id: "sukanya",
      name: "Sukanya Samriddhi Yojana",
      ministry: "Ministry of Finance",
      benefit_inr: 150000,
      benefit_text: "8.2% tax-free interest savings for girl child (up to age 21)",
      tagline: "Long-term savings for the girl child",
      eligibility: {
        category: ["girl-child-parent"],
      },
      apply_url: "https://www.indiapost.gov.in",
      docs_required: ["Birth certificate of girl child", "Aadhaar of parent", "Address proof"],
    },
    {
      id: "pm-vishwakarma",
      name: "PM Vishwakarma",
      ministry: "Ministry of MSME",
      benefit_inr: 300000,
      benefit_text: "₹3 lakh collateral-free loan at 5% interest + ₹15,000 toolkit e-voucher",
      tagline: "Support for traditional artisans and craftspeople",
      eligibility: {
        occupations: ["artisan", "worker", "self-employed"],
        min_age: 18,
      },
      apply_url: "https://pmvishwakarma.gov.in",
      docs_required: ["Aadhaar", "Bank passbook", "Artisan ID Card", "Photo"],
    },
    {
      id: "stand-up-india",
      name: "Stand Up India",
      ministry: "Ministry of Finance",
      benefit_inr: 10000000,
      benefit_text: "Loans between ₹10 lakh and ₹1 crore for setting up greenfield enterprises",
      tagline: "Empowering SC/ST and Women entrepreneurs",
      eligibility: {
        category: ["sc", "st", "women"],
        min_age: 18,
      },
      apply_url: "https://www.standupmitra.in",
      docs_required: ["Aadhaar", "PAN card", "Caste certificate", "Business plan", "Bank statement"],
    },
    {
      id: "pm-ujjwala",
      name: "PM Ujjwala Yojana 2.0",
      ministry: "Ministry of Petroleum",
      benefit_inr: 1600,
      benefit_text: "Free LPG connection + ₹1,600 cash assistance",
      tagline: "Clean cooking fuel for BPL households",
      eligibility: {
        max_income: 100000,
        category: ["minority", "sc", "st"],
      },
      apply_url: "https://www.pmuy.gov.in",
      docs_required: ["Aadhaar", "Ration card", "Address proof", "Photo"],
    },
    {
      id: "pm-gkay",
      name: "PM Garib Kalyan Anna Yojana",
      ministry: "Ministry of Consumer Affairs",
      benefit_inr: 1000,
      benefit_text: "5 kg free food grains per person per month",
      tagline: "Food security for the underprivileged",
      eligibility: {
        max_income: 150000,
      },
      apply_url: "https://nfsa.gov.in",
      docs_required: ["Ration card", "Aadhaar"],
    },
  ],

  findEligible: (user) => {
    const age = parseInt(user.age) || 0;
    const income = parseInt(user.income) || 0;
    const occupation = (user.occupation || "").toLowerCase().trim();
    const category = (user.category || "").toLowerCase().trim();

    let matched = ruleEngine.schemes.filter(scheme => {
      const elig = scheme.eligibility;
      let ok = true;

      if (elig.occupations) {
        if (!elig.occupations.map(o => o.toLowerCase()).includes(occupation)) {
          ok = false;
        }
      }

      if (ok && elig.max_income) {
        if (income > elig.max_income) {
          ok = false;
        }
      }

      if (ok && elig.min_age && age < elig.min_age) {
        ok = false;
      }
      if (ok && elig.max_age && age > elig.max_age) {
        ok = false;
      }

      if (ok && elig.category) {
        if (!elig.category.map(c => c.toLowerCase()).includes(category)) {
          ok = false;
        }
      }

      return ok;
    });

    // Add relevance and match reasons
    matched = matched.map(scheme => ({
      ...scheme,
      match_reasons: ["Profile matches base eligibility"]
    }));

    // Sort by benefit amount
    matched.sort((a, b) => b.benefit_inr - a.benefit_inr);

    // Return ALL matches as requested (nerfed the limit)
    return matched;
  }
};

export const serviceDocs = {
  scholarship: {
    name: "Scholarship Application",
    required: [
      { key: "aadhaar", label: "Aadhaar Card", hint: "Front + back" },
      { key: "income_certificate", label: "Income Certificate", hint: "Issued by Tehsildar / SDM" },
      { key: "marksheet", label: "Last Passed Marksheet", hint: "Class 10 / 12 / latest" },
      { key: "bank_passbook", label: "Bank Passbook", hint: "First page with IFSC" },
      { key: "photo", label: "Passport-size Photo", hint: "Recent, white background" },
      { key: "domicile", label: "Domicile Certificate", hint: "State residence proof" },
    ],
  },
  msme: {
    name: "MSME / Udyam Registration",
    required: [
      { key: "aadhaar", label: "Aadhaar Card", hint: "Of business owner" },
      { key: "pan", label: "PAN Card", hint: "Personal or Business PAN" },
      { key: "bank_passbook", label: "Bank Passbook", hint: "Business bank account preferred" },
      { key: "address_proof", label: "Business Address Proof", hint: "Electricity bill / rent agreement" },
      { key: "project_report", label: "Project Report (optional)", hint: "Required for PMEGP loan" },
    ],
  },
  license: {
    name: "Driving License (Learner)",
    required: [
      { key: "aadhaar", label: "Aadhaar Card", hint: "ID proof" },
      { key: "address_proof", label: "Address Proof", hint: "Voter ID / utility bill" },
      { key: "age_proof", label: "Age Proof", hint: "Birth certificate / Class 10 marksheet" },
      { key: "photo", label: "Passport-size Photo", hint: "Recent" },
      { key: "form_1a", label: "Form 1-A (Medical Fitness)", hint: "Required if age 40+ or commercial" },
      { key: "signature", label: "Signature Sample", hint: "On white paper" },
    ],
  },
};
