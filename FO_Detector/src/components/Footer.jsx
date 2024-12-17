import React from "react";
import Logos from "../assets/Logos";

const Footer = () => {
  return (
    <div>
      <footer class="bg-white">
        <div class="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div class="sm:flex sm:items-center sm:justify-between">
            <a
              href="https://flowbite.com/"
              class="flex items-center mb-4 sm:mb-0 space-x-8 rtl:space-x-reverse"
            >
              <img src={Logos.Grid_India} class="h-20" alt="Grid India Logo" />
              <img src={Logos.Smart_Grid} class="h-20" alt="Smart Grid Logo" />
              <img src={Logos.IIT_Patna} class="h-20" alt="IIT Patna Logo" />
            </a>
            <ul class="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0">
              <li>
                <a href="#" class="hover:underline me-4 md:me-6">
                  About
                </a>
              </li>
              <li>
                <a href="#" class="hover:underline me-4 md:me-6">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" class="hover:underline me-4 md:me-6">
                  Licensing
                </a>
              </li>
              <li>
                <a href="#" class="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <hr class="my-6 border-gray-200 sm:mx-auto lg:my-8" />
          <span class="block text-sm text-gray-500 sm:text-center">
            © 2024{" "}
            <a href="https://flowbite.com/" class="hover:underline">
              IIT Patna™
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
