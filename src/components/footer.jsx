import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaGithub,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-400 pb-7 pt-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Bayti Home</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Where modern buildings are available for rent and sale worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/offers"
                  className="hover:text-white transition-colors"
                >
                  Offers
                </a>
              </li>
              <li>
                <a href="/rent" className="hover:text-white transition-colors">
                  Rent
                </a>
              </li>
              <li>
                <a href="/sell" className="hover:text-white transition-colors">
                  Sell
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:prog.al.jafarawy@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  prog.al.jafarawy@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/201113802924"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  +201113802924
                </a>
              </li>
              <li className="text-gray-400">Damanhour, Al Beheira, Egypt</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
            <div className="grid grid-rows-2 gap-4">
              {/* Row 1 */}
              <div className="grid grid-flow-col auto-cols-auto gap-4 justify-start">
                <a
                  href="https://www.linkedin.com/in/ahmed-al-jafarawy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 hover:border-white hover:text-white transition"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn />
                </a>
                <a
                  href="https://github.com/Al-Jafarawy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 hover:border-white hover:text-white transition"
                  aria-label="GitHub"
                >
                  <FaGithub />
                </a>
                <a
                  href="https://www.facebook.com/ahmed.mo.al.jafarawy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 hover:border-white hover:text-white transition"
                  aria-label="Facebook"
                >
                  <FaFacebookF />
                </a>
              </div>

              {/* Row 2 */}
              <div className="grid grid-flow-col auto-cols-auto gap-4 justify-start">
                <a
                  href="https://x.com/AlJafarawy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 hover:border-white hover:text-white transition"
                  aria-label="Twitter"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://www.instagram.com/ahmed_mo_aljafarawy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 hover:border-white hover:text-white transition"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-700 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Bayti Home. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
