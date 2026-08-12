import { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { LOAN_PRODUCTS } from '../lib/loanData';
import { LoanType } from '../lib/loanEngine';
import { CheckCircle2, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { trackHighInterestTimeOnPage } from '../services/trackingService';

export default function LoanProduct() {
  const { loanId } = useParams<{ loanId: string }>();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [loanId]);

  // Track time spent on loan product pages for high-interest segment targeting (>2 mins)
  useEffect(() => {
    if (!loanId || !LOAN_PRODUCTS[loanId]) return;
    const productName = LOAN_PRODUCTS[loanId].name;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const secondsSpent = Math.floor((Date.now() - startTime) / 1000);
      if (secondsSpent >= 120) {
        trackHighInterestTimeOnPage(productName, secondsSpent);
      }
    }, 15000); // check periodically

    return () => clearInterval(timer);
  }, [loanId]);

  if (!loanId || !LOAN_PRODUCTS[loanId]) {
    return <Navigate to="/" replace />;
  }

  const product = LOAN_PRODUCTS[loanId];
  
  // Cast loanId to LoanType if applicable to the engine. Sync with loanEngine.ts
  const engineLoanType = loanId as LoanType;

  return (
    <main className="flex-grow flex flex-col items-center w-full bg-white">
      {/* Hero Banner */}
      <section className="w-full bg-[#074504] text-white py-20 lg:py-32 px-6 lg:px-12 relative overflow-hidden flex justify-center">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#599200] rounded-full blur-[150px] opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto w-full relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            {product.image && (
              <div className="mb-8 rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl animate-in fade-in slide-in-from-left-4 duration-700 bg-white/5">
                <img 
                  src={encodeURI(product.image)} 
                  alt={product.name} 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.triedFallback && product.driveFallback) {
                      target.dataset.triedFallback = 'true';
                      target.src = product.driveFallback;
                    } else if (!target.dataset.triedUnsplash) {
                      target.dataset.triedUnsplash = 'true';
                      target.src = `https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800&text=${encodeURIComponent(product.name)}`;
                    }
                  }}
                />
              </div>
            )}
            <div className="inline-flex items-center gap-3 justify-center mb-4">
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
              <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">
              Loan Product
            </span>
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
            </div>
            <h1 className="text-4xl lg:text-7xl font-extrabold mb-8 leading-[1.1] tracking-tight uppercase">
              {product.name}
            </h1>
            <p className="text-lg lg:text-xl text-white/80 max-w-lg mb-12 font-medium leading-relaxed">
              {product.tagline}. Optimized for local realities, processed with global efficiency.
            </p>
            <Link to="/pre-qualification" className="inline-flex items-center gap-2 bg-[#599200] hover:bg-[#28A428] text-white font-bold py-4 px-8 rounded-full transition-transform hover:scale-105 duration-300 shadow-[0_10px_20px_rgba(50,205,50,0.3)]">
              Check your loan eligibility
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-8 text-gray-900 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-[#599200]" />
            <h3 className="text-2xl font-bold mb-4 text-[#074504]">Why choose {product.name}?</h3>
            <p className="text-gray-600 leading-relaxed mb-6 font-medium">
              {product.description}
            </p>

            {product.targetMarket && (
              <div className="bg-[#074504]/5 rounded-2xl p-5 mb-8 border border-[#074504]/10">
                <p className="font-bold text-[#074504] mb-2 text-sm uppercase tracking-wider">Target Market</p>
                <p className="text-sm text-gray-700 font-medium leading-relaxed">{product.targetMarket}</p>
              </div>
            )}
            
            <ul className="space-y-3 mb-8">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm font-medium text-gray-600">
                  <CheckCircle2 className="w-5 h-5 text-[#C0991B] shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <div>
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-[#074504] border border-[#074504]/20 rounded-full hover:bg-[#F4F7F6] transition-colors mb-4"
              >
                View Details and Eligibility {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {isExpanded && (
                <div className="bg-[#F4F7F6] rounded-2xl p-4 mb-4 text-sm text-gray-600 border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
                  <p className="font-bold text-gray-800 mb-2 uppercase text-[10px] tracking-wider">Eligibility</p>
                  <ul className="space-y-1 mb-4 text-xs font-medium">
                    <li>• Valid Kenyan National ID</li>
                    <li>• Proof of income or business</li>
                    <li>• Age 18-70 years</li>
                  </ul>
                  <p className="font-bold text-gray-800 mb-2 uppercase text-[10px] tracking-wider">Required Documents</p>
                  <ul className="space-y-1 text-xs font-medium">
                    <li>• National ID / Passport</li>
                    <li>• 3 months bank statements</li>
                    <li>• Utility bill (proof of residence)</li>
                  </ul>
                </div>
              )}

              <Link 
                to={`/registration`}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-full font-bold text-white bg-[#074504] hover:bg-[#053303] transition-transform hover:scale-105 shadow-md"
              >
                Apply for {product.name} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-[#F4F7F6]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-[#074504] mb-6 tracking-tight uppercase">Ready to get started?</h2>
          <p className="text-gray-600 mb-10 font-medium leading-relaxed">
            Our loan officers are standing by to help you navigate your financial journey with ease and transparency.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/pre-qualification" className="w-full sm:w-auto bg-[#074504] text-white font-bold py-4 px-10 rounded-full hover:bg-[#053303] transition-all text-sm uppercase tracking-widest">
              Check Pre-Qualification
            </Link>
            <Link to="/contact" className="w-full sm:w-auto bg-white border-2 border-[#074504]/20 text-[#074504] font-bold py-4 px-10 rounded-full hover:border-[#074504] transition-all text-sm uppercase tracking-widest">
              Request a Call Back
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
