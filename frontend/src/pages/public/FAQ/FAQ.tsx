import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Search, MessageCircle } from 'lucide-react';

const FAQ = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Changes the browser tab title when the page loads
  useEffect(() => {
    document.title = "FAQ | FaceTrack";
  }, []);

  const faqData = [
    {
      question: "How does FaceTrack handle attendance?",
      answer: "FaceTrack uses a live video stream to identify faces and cross-reference them with the database in real-time, automatically logging attendance with timestamps."
    },
    {
      question: "What should I do if my face isn't recognized?",
      answer: "Ensure you are in a well-lit area and looking directly at the camera. If issues persist, you can update your profile photo or submit a query to our support team."
    },
    {
      question: "Can FaceTrack recognize multiple people at once?",
      answer: "Yes! Our system is designed to detect and process multiple faces simultaneously within the camera's field of view, making group attendance seamless."
    },
    {
      question: "How can I view my attendance history?",
      answer: "You can view your personal attendance history, including timestamps and total days present, by logging into your user dashboard and navigating to the 'My Records' tab."
    },
    {
      question: "How do I register my face in the system for the first time?",
      answer: "During your initial onboarding, an administrator will capture a short video or multiple photos of your face from different angles to create your unique, secure biometric profile."
    },
    {
      question: "What should I do if I am incorrectly marked absent?",
      answer: "If you believe the system missed you, please contact your instructor or administrator. They have manual override privileges to review and correct attendance records."
    },
    {
      question: "Can I use FaceTrack on my mobile device?",
      answer: "Yes, the FaceTrack frontend is fully responsive and can be accessed via any mobile browser with camera permissions enabled."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We encrypt all biometric data and do not store raw images, only numerical facial embeddings for recognition purposes."
    }
  ];

  const filteredFaqs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F0F0DB] font-sans">
      
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-br from-[#1e2336] via-[#30364F] to-[#424a6b] py-24 px-4 text-center overflow-hidden">
        
        {/* Decorative Background Blurs */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#ACBAC4] opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#F0F0DB] opacity-10 blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#F0F0DB] mb-6 tracking-tight drop-shadow-md">
            FAQs
          </h1>
          <p className="text-[#ACBAC4] text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
            How can the FaceTrack team help you?
          </p>
          
          {/* Styled Search Bar */}
          <div className="max-w-2xl mx-auto relative group shadow-2xl rounded-2xl">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-[#30364F] opacity-50 group-focus-within:opacity-100 transition-opacity" size={24} />
            <input
              type="text"
              placeholder="Search for answers..."
              className="w-full pl-16 pr-6 py-5 rounded-2xl border-none focus:ring-4 focus:ring-[#ACBAC4] focus:outline-none text-[#30364F] text-lg font-semibold transition-all bg-[#F0F0DB]"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* FAQ List */}
      <div className="max-w-3xl mx-auto py-12 px-6">
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-sm border border-[#ACBAC4] overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-bold text-[#30364F] text-lg">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="text-[#30364F]" />
                  ) : (
                    <ChevronDown className="text-[#30364F]" />
                  )}
                </button>
                
                {openIndex === index && (
                  <div className="p-5 pt-0 text-gray-600 border-t border-gray-100 animate-fadeIn">
                    <p className="leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">No matching questions found.</p>
          )}
        </div>

        {/* Support Section */}
        <div className="mt-16 bg-[#ACBAC4] bg-opacity-30 rounded-2xl p-8 text-center border-2 border-[#30364F] border-dashed">
          <MessageCircle className="mx-auto mb-4 text-[#30364F]" size={40} />
          <h2 className="text-2xl font-bold text-[#30364F] mb-2">Still have questions?</h2>
          <p className="text-[#30364F] opacity-80 mb-6">
            If you can't find the answer you're looking for, please submit a detailed query.
          </p>
          <button
            onClick={() => navigate('/query')}
            className="px-8 py-3 bg-[#30364F] text-[#F0F0DB] font-bold rounded-lg hover:scale-105 transition-transform shadow-lg"
          >
            Submit a Query
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;