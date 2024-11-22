import { FaTwitter, FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto text-center">
        <p className="mb-4">Connect with me:</p>
        <nav aria-label="Social media links" className="flex justify-center space-x-6">
          <a
            href="https://x.com/NishulDhakar"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-transform transform hover:scale-110"
            aria-label="Twitter"
          >
            <FaTwitter className="w-6 h-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/nishuldhakar/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-transform transform hover:scale-110"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="w-6 h-6" />
          </a>
          <a
            href="https://www.instagram.com/nishuldhakar/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400 transition-transform transform hover:scale-110"
            aria-label="Instagram"
          >
            <FaInstagram className="w-6 h-6" />
          </a>
          <a
            href="https://github.com/nishuldhakar"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-transform transform hover:scale-110"
            aria-label="GitHub"
          >
            <FaGithub className="w-6 h-6" />
          </a>
        </nav>
        <p className="mt-4 text-sm"></p>
      </div>
    </footer>
  );
};

export default Footer;
