import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';

const PAGE_FLOW = [
  { path: '/', label: 'Home' },
  { path: '/about-us', label: 'About Us' },
  { path: '/loans', label: 'Products' },
  { path: '/programs', label: 'Programs' },
  { path: '/sponsorship', label: 'Sponsorship' },
  { path: '/beneficiaries', label: 'Beneficiaries' },
  { path: '/partnership', label: 'Partnership' },
  { path: '/join', label: 'Join Us' },
  { path: '/pre-qualification', label: 'Check Loan Eligibility' },
  { path: '/portal', label: 'Portal Login' },
  { path: '/contact', label: 'Contact Us' },
  { path: '/blog', label: 'Blog' },
];

export default function PageNavigation() {
  const { pathname } = useLocation();

  const isDashboardOrPortal = pathname.startsWith('/admin') || 
                              pathname.startsWith('/staff-portal') || 
                              pathname === '/portal' ||
                              pathname.startsWith('/blog') ||
                              pathname === '/volunteer' ||
                              pathname === '/volunteers' ||
                              pathname === '/faq';

  if (isDashboardOrPortal || pathname === '/') return null; // Typically Home doesn't need a "Back to Home", but we'll see. Let's show it on all EXCEPT home to be cleaner, or show it everywhere. Let's just show it everywhere except Home.
  
  // Find current index
  let currentIndex = PAGE_FLOW.findIndex(p => p.path === pathname);
  
  // Handle dynamic paths like /loans/mali or /programs/health
  if (currentIndex === -1) {
    if (pathname.startsWith('/loans/')) currentIndex = 3; // Loan Products
    else if (pathname.startsWith('/programs/')) currentIndex = 2; // Our Programs
    else currentIndex = -2; // Unknown, just show back to home
  }

  let prevPage = currentIndex > 0 ? PAGE_FLOW[currentIndex - 1] : { path: '/', label: 'Home' };
  let nextPage = currentIndex >= 0 && currentIndex < PAGE_FLOW.length - 1 ? PAGE_FLOW[currentIndex + 1] : null;

  // If we couldn't match a flow page, at least give a "Back to Home" and "Our Loans"
  if (currentIndex === -2) {
    prevPage = { path: '/', label: 'Home' };
    nextPage = { path: '/loans', label: 'Explore Loans' };
  }

  return (
    <div className="w-full bg-white border-t border-gray-100 py-6 px-6 lg:px-12 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        
        <Link 
          to={prevPage.path}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold transition-colors border border-gray-200 w-full sm:w-auto justify-center"
        >
          <ArrowLeft className="w-4 h-4 text-[#C0991B]" />
          <span>{prevPage.path === '/' ? 'Back to Home' : `Back to ${prevPage.label}`}</span>
        </Link>

        {nextPage && (
          <Link 
            to={nextPage.path}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#074504]/5 hover:bg-[#074504]/10 text-[#074504] font-bold transition-colors border border-[#074504]/10 w-full sm:w-auto justify-center"
          >
            <span>Continue to {nextPage.label}</span>
            <ArrowRight className="w-4 h-4 text-[#C0991B]" />
          </Link>
        )}
      </div>
    </div>
  );
}
