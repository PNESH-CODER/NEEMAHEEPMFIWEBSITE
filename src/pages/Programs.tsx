import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, HeartPulse, TrendingUp, CheckCircle2, Users, GraduationCap, Target, Globe } from 'lucide-react';
import { motion } from 'motion/react';

export default function Programs() {
  const stats = [
    {
      icon: <Users className="w-10 h-10" />,
      value: "Thousands",
      label: "Entrepreneurs Supported",
      description: "Through our core microfinance loans, we've helped scale thousands of businesses and livelihoods across 7 counties.",
      to: "/programs/economic-empowerment",
      cta: "Economic Programs"
    },
    {
      icon: <GraduationCap className="w-10 h-10" />,
      value: "15,000+",
      label: "Students Impacted",
      description: "Securing the future of junior secondary students from grade 10 to 12 through our Arise & Shine sponsorship and holiday mentorship since 2011.",
      to: "/programs/education-support",
      cta: "Arise & Shine Program"
    },
    {
      icon: <HeartPulse className="w-10 h-10" />,
      value: "50+",
      label: "Medical Camps Hosted",
      description: "Bringing essential healthcare services directly to marginalized areas across the Mount Kenya region.",
      to: "/programs/community-health",
      cta: "Health Initiatives"
    }
  ];

  const programs = [
    {
      title: "Arise & Shine Education",
      icon: <BookOpen className="w-12 h-12" />,
      tagline: "Academic merit. Social need. Mentorship.",
      description: "Empowering junior secondary students from grade 10 to 12 through comprehensive school scholarships, fee support, and holiday-time mentorship.",
      highlights: ["Sponsorship Since 2011", "Holiday Mentorship", "Grade 10 to 12 Focus"],
      to: "/programs/education-support",
      color: "bg-emerald-50 text-[#074504] border-emerald-200",
      iconColor: "text-[#C0991B]"
    },
    {
      title: "Community Health",
      icon: <HeartPulse className="w-12 h-12" />,
      tagline: "Well-being is the foundation of wealth.",
      description: "Promoting well-being by financing maternal care, medical camps, and targeted WASH loans to ensure families stay healthy and productive.",
      highlights: ["Maternal Care Financing", "Healthcare Camps", "WASH Initiatives"],
      to: "/programs/community-health",
      color: "bg-amber-50/70 text-[#826507] border-amber-200",
      iconColor: "text-[#C0991B]"
    },
    {
      title: "Economic Empowerment",
      icon: <TrendingUp className="w-12 h-12" />,
      tagline: "Resilient communities through business.",
      description: "Fostering resilience through business mentorship, group lending, and market linkages for SMEs relying on sustainable financial solutions.",
      highlights: ["Business Mentorship", "Market Network Linkages", "Group Growth Capital"],
      to: "/programs/economic-empowerment",
      color: "bg-emerald-50 text-[#074504] border-emerald-200",
      iconColor: "text-[#C0991B]"
    }
  ];

  return (
    <main className="flex-grow bg-[#f8faf8] pb-20 font-sans">
      {/* Hero Section */}
      <section className="bg-[#074504] text-white py-24 lg:py-32 px-6 lg:px-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#C0991B] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#599200] rounded-full blur-[150px]" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-8"
          >
            <Target className="w-4 h-4 text-[#C0991B]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#C0991B]">Driven by Purpose</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 tracking-tighter uppercase leading-[0.95]"
          >
            Our <span className="text-[#C0991B]">Programs</span> & <br/>
            Real-World <span className="text-[#599200]">Impact</span>.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Neema HEEP goes beyond credit. We measure success by the strength of our communities, the health of our families, and the resilience of the businesses we foster.
          </motion.p>
        </div>
      </section>

      {/* Impact Stats Grid (From Impact Page) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 -mt-16 relative z-20">
        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.1)] text-center flex flex-col items-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 text-[#C0991B] group-hover:bg-[#C0991B]/10 transition-all">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-black text-[#074504] mb-1 tracking-tighter">{stat.value}</h3>
              <p className="text-[#C0991B] font-bold text-xs mb-4 uppercase tracking-[0.2em]">{stat.label}</p>
              <p className="text-gray-500 font-medium text-xs leading-relaxed mb-6">
                {stat.description}
              </p>
              <Link 
                to={stat.to} 
                className="mt-auto flex items-center gap-2 text-[#074504] font-black uppercase text-[10px] tracking-widest hover:gap-3 transition-all"
              >
                {stat.cta} <ArrowRight className="w-3 h-3 text-[#C0991B]" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Programs Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-32">
        <div className="text-center mb-16">
           <div className="inline-flex items-center gap-2 text-[#599200] font-black uppercase text-xs tracking-widest mb-4">
              <span className="w-6 h-0.5 bg-[#C0991B]"></span> OUR CORE INITIATIVES <span className="w-6 h-0.5 bg-[#C0991B]"></span>
           </div>
           <h2 className="text-3xl md:text-5xl font-extrabold text-[#074504] uppercase tracking-tight">Structured <span className="text-[#C0991B]">Support</span></h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="h-full"
            >
              <Link 
                to={program.to} 
                className="group h-full bg-white border border-gray-100 p-10 rounded-[2.5rem] flex flex-col items-start hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-[#C0991B]/20 transition-all duration-500"
              >
                <motion.div 
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-8 group-hover:bg-[#C0991B]/10 transition-colors duration-500"
                >
                  <div className={`${program.iconColor} group-hover:scale-110 transition-transform duration-500`}>
                    {program.icon}
                  </div>
                </motion.div>
                
                <h3 className="text-3xl font-extrabold text-[#074504] mb-2 uppercase tracking-tight">{program.title}</h3>
                <p className="text-[#C0991B] font-bold text-sm mb-4 tracking-wide uppercase">{program.tagline}</p>
                <p className="text-gray-600 mb-8 leading-relaxed font-semibold">
                  {program.description}
                </p>
                
                <div className="space-y-3 mb-10 w-full flex-grow">
                  {program.highlights.map((item, i) => (
                    <motion.div 
                      key={i} 
                      className="flex items-center gap-3 text-sm font-bold text-[#074504]/80"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: (idx * 0.1) + (i * 0.05) }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#599200]" />
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-[#074504] font-black uppercase text-[10px] tracking-widest group-hover:gap-4 transition-all mt-auto pt-6 border-t border-gray-100 w-full">
                  Explore Initiative <ArrowRight className="w-4 h-4 text-[#C0991B]" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sponsorship Application Block on Programs.tsx */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
         <div className="bg-gradient-to-r from-[#074504] to-[#599200] rounded-[3.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="absolute top-[-50%] right-[-10%] w-[350px] h-[350px] bg-[#C0991B]/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 lg:max-w-3xl">
               <span className="bg-[#C0991B] text-[#074504] px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] inline-block mb-4">Scholarship Intake Open</span>
               <h3 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight mb-4">Seeking School Fees Scholarship Support?</h3>
               <p className="text-white/80 text-sm font-semibold leading-relaxed max-w-2xl">
                 Disadvantaged families, single mothers, and youth seeking active secondary school scholarships for grades 10 to 12 can apply directly through the Arise & Shine Junior/Senior School Scholarship portal.
               </p>
            </div>
            <div className="relative z-10 shrink-0 w-full lg:w-auto flex flex-col sm:flex-row gap-4">
               <Link to="/sponsorship" className="block w-full sm:w-auto text-center bg-[#C0991B] hover:bg-[#A38217] text-[#074504] px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg transition-transform hover:scale-105 min-w-[200px]">
                 Apply For Scholarship
               </Link>
               <Link to="/beneficiaries" className="block w-full sm:w-auto text-center bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm px-8 py-5 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all min-w-[200px]">
                 View Beneficiaries
               </Link>
            </div>
         </div>
      </section>

      {/* Vision Section (From Impact Page) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-32">
        <div className="bg-white border border-gray-100 rounded-[4rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-16 overflow-hidden relative border border-emerald-900/10 shadow-sm">
          
          <div className="lg:w-1/2 relative z-10">
            <div className="inline-flex items-center gap-2 text-[#599200] font-black uppercase text-xs tracking-widest mb-6">
              <Target className="w-4 h-4" /> The Vision
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#074504] mb-8 leading-[1.1] uppercase tracking-tight">
              Sustainable <br/>
              Wealth <span className="text-[#C0991B]">Generation</span>.
            </h2>
            <div className="space-y-6 text-gray-600 font-medium leading-relaxed">
              <p>
                Our impact strategy is built on the belief that financial inclusion is the most powerful tool for poverty eradication. By providing not just credit, but the knowledge to use it effectively, we create a ripple effect of prosperity.
              </p>
              <p>
                Since 2010, Neema HEEP has grown from a small local initiative to a multi-branch powerhouse of community transformation, serving thousands of families in the Mount Kenya region and beyond.
              </p>
            </div>
          </div>
          
          <div className="lg:w-1/2 grid grid-cols-2 gap-4 w-full relative z-10">
            <div className="space-y-4">
              <div className="bg-[#f8faf8] p-8 rounded-[2.5rem] border border-gray-100">
                <h4 className="text-3xl font-black text-[#599200] mb-1">98%</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Repayment Success</p>
              </div>
              <div className="bg-[#074504] text-white p-8 rounded-[2.5rem] shadow-xl">
                <h4 className="text-3xl font-black text-[#C0991B] mb-1">24Hr</h4>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Response Time</p>
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="bg-[#f8faf8] p-8 rounded-[2.5rem] border border-gray-100">
                <h4 className="text-3xl font-black text-[#C0991B] mb-1">60%</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Women Borrowers</p>
              </div>
              <div className="bg-[#599200] text-white p-8 rounded-[2.5rem] shadow-xl">
                <h4 className="text-3xl font-black text-white mb-1">100%</h4>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Local Execution</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Merged Call to Action */}
      <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] px-6 lg:px-12 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#074504] rounded-[3.5rem] p-10 md:p-20 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C0991B] rounded-full blur-[100px] opacity-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#599200] rounded-full blur-[100px] opacity-10 pointer-events-none" />
            
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-[#C0991B] text-[#074504] px-4 py-1.5 rounded-full mb-6 font-black text-[10px] uppercase tracking-[0.2em] shadow-lg">
                Get Involved
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight uppercase">
                Ready to <span className="text-[#C0991B]">Partner</span> with <br className="hidden lg:block"/> the Neema family?
              </h2>
              <p className="text-white/70 text-lg font-medium mb-0 max-w-xl">
                We are always looking for institutional partners, NGOs, and stakeholders who share our vision of sustainable financial solutions and community upliftment.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
              <Link to="/request-partnership" className="bg-[#C0991B] hover:bg-[#A38217] text-[#074504] px-10 py-5 rounded-full font-extrabold shadow-xl transition-all hover:scale-105 text-center min-w-[200px] uppercase text-xs tracking-widest">
                Partner with us
              </Link>
              <Link to="/registration" className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-white px-10 py-5 rounded-full font-bold transition-all text-center min-w-[200px] uppercase text-xs tracking-widest">
                Become a Member
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


