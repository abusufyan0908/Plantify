/* eslint-disable no-unused-vars */
import React, { useState } from "react";

const Contact = () => {
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append("access_key", "d5d56c14-6509-4035-90cf-c8afb72347bc");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      }).then((res) => res.json());

      if (res.success) {
        setSuccessMessage("Your message has been successfully sent!");
        event.target.reset(); // Reset form fields after submission
      } else {
        setSuccessMessage("There was an error sending your message. Please try again.");
      }
    } catch (error) {
      setSuccessMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <section className="relative z-10 overflow-hidden bg-white py-20 dark:bg-dark lg:py-[120px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap lg:justify-between">
          <div className="w-full px-4 lg:w-1/2 xl:w-6/12">
            <div className="mb-12 max-w-[570px] lg:mb-0">
              <h2 className="mb-6 text-[32px] font-bold uppercase text-dark dark:text-white sm:text-[40px] lg:text-[36px] xl:text-[40px]">
                GET IN TOUCH WITH US
              </h2>
              <p className="mb-9 text-base leading-relaxed text-body-color dark:text-dark-6">
                We’d love to hear from you! Whether you have a question, feedback, or need assistance, our team is here to help.
              </p>

              <div className="mb-8 flex w-full max-w-[370px]">
                <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded bg-primary/5 text-primary sm:h-[70px] sm:max-w-[70px]">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M30.6 11.8002L17.7 3.5002C16.65 2.8502 15.3 2.8502 14.3 3.5002L1.39998 11.8002C0.899983 12.1502 0.749983 12.8502 1.04998 13.3502C1.39998 13.8502 2.09998 14.0002 2.59998 13.7002L3.44998 13.1502V25.8002C3.44998 27.5502 4.84998 28.9502 6.59998 28.9502H25.4C27.15 28.9502 28.55 27.5502 28.55 25.8002V13.1502L29.4 13.7002C29.6 13.8002 29.8 13.9002 30 13.9002C30.35 13.9002 30.75 13.7002 30.95 13.4002C31.3 12.8502 31.15 12.1502 30.6 11.8002ZM13.35 26.7502V18.5002C13.35 18.0002 13.75 17.6002 14.25 17.6002H17.75C18.25 17.6002 18.65 18.0002 18.65 18.5002V26.7502H13.35ZM26.3 25.8002C26.3 26.3002 25.9 26.7002 25.4 26.7002H20.9V18.5002C20.9 16.8002 19.5 15.4002 17.8 15.4002H14.3C12.6 15.4002 11.2 16.8002 11.2 18.5002V26.7502H6.69998C6.19998 26.7502 5.79998 26.3502 5.79998 25.8502V11.7002L15.5 5.4002C15.8 5.2002 16.2 5.2002 16.5 5.4002L26.3 11.7002V25.8002Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="w-full">
                  <h4 className="mb-1 text-xl font-bold text-dark dark:text-white">
                    Our Location
                  </h4>
                  <p className="text-base text-body-color dark:text-dark-6">
                    Superior University City Campus Ploat 22 Gulberg Lahore
                  </p>
                </div>
              </div>

              <div className="mb-8 flex w-full max-w-[370px]">
                <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded bg-primary/5 text-primary sm:h-[70px] sm:max-w-[70px]">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M24.3 31.1499C22.95 31.1499 21.4 30.7999 19.7 30.1499C16.3 28.7999 12.55 26.1999 9.19997 22.8499C5.84997 19.4999 3.24997 15.7499 1.89997 12.2999C0.39997 8.59994 0.54997 5.54994 2.29997 3.84994C2.34997 3.79994 2.44997 3.74994 2.49997 3.69994L6.69997 1.19994C7.74997 0.599942 9.09997 0.899942 9.79997 1.89994L12.75 6.29994C13.45 7.34994 13.15 8.74994 12.15 9.44994L10.35 10.6999C11.65 12.7999 15.35 17.9499 21.25 21.6499L22.35 20.0499C23.2 18.8499 24.55 18.4999 25.65 19.2499L30.05 22.1999C31.05 22.8999 31.35 24.2499 30.75 25.2999L28.25 29.4999C28.2 29.5999 28.15 29.6499 28.1 29.6999C27.2 30.6499 25.9 31.1499 24.3 31.1499ZM3.79997 5.54994C2.84997 6.59994 2.89997 8.74994 3.99997 11.4999C5.24997 14.6499 7.64997 18.0999 10.8 21.2499C13.9 24.3999 16.75 27.0499 18.85 28.2499C19.65 28.6499 20.55 28.7999 21.35 28.6499C21.75 28.5999 22.05 28.4999 22.25 28.2499L24.75 25.7499C25.05 25.4499 24.95 24.9499 24.55 24.6499C23.65 23.8499 23.2 23.1499 23.25 22.2499C23.3 21.8499 23.7 21.4499 24.1 21.2499C24.4 21.0499 24.75 21.1499 24.95 21.3999C25.35 21.8499 26.2 22.6499 27.2 23.1999L26.05 24.8499C25.6 25.6499 25.2 26.3999 24.8 27.0499C23.75 28.2499 22.3 28.5499 20.8 27.7999C19.6 27.1499 18.4 26.2499 17.5 25.3999C16.9 24.8499 16.25 24.3999 15.75 23.8499L13.5 21.5999C12.95 20.8499 13.25 19.9999 14.05 19.5999L15.35 18.5999C14.85 17.8499 13.65 16.9499 12.6 15.9499L11.15 15.3999C9.85 14.3499 8.7 13.2499 7.7 12.2499C7.15 11.6499 7.45 10.7499 8.15 10.4499L9.95 9.19994L6.49997 4.59994L3.79997 5.54994Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="w-full">
                  <h4 className="mb-1 text-xl font-bold text-dark dark:text-white">
                    Contact Number
                  </h4>
                  <p className="text-base text-body-color dark:text-dark-6">
                    +1 234 567 8900
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
            <div className="bg-white p-8 shadow-lg dark:bg-dark-2 dark:shadow-lg">
              <h2 className="mb-8 text-3xl font-bold text-dark dark:text-white">
                Get In Touch
              </h2>

              <form onSubmit={onSubmit}>
                <div className="mb-4">
                  <label
                    className="mb-2 block text-base font-medium text-dark dark:text-white"
                    htmlFor="name"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    className="w-full rounded border border-gray-300 px-4 py-3 text-base font-medium text-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white dark:border-dark-3 dark:focus:ring-primary dark:focus:border-primary"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="mb-2 block text-base font-medium text-dark dark:text-white"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email address"
                    className="w-full rounded border border-gray-300 px-4 py-3 text-base font-medium text-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white dark:border-dark-3 dark:focus:ring-primary dark:focus:border-primary"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="mb-2 block text-base font-medium text-dark dark:text-white"
                    htmlFor="message"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    placeholder="Write your message"
                    className="w-full rounded border border-gray-300 px-4 py-3 text-base font-medium text-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white dark:border-dark-3 dark:focus:ring-primary dark:focus:border-primary"
                    required
                  ></textarea>
                </div>

                <div className="mb-6 flex items-center justify-between">
                  <button
                    type="submit"
                    className="w-full rounded bg-primary py-3 px-6 text-base font-semibold bg-[rgb(33,155,157)] text-black transition duration-300 hover:bg-primary-dark focus:outline-none"
                  >
                    Send Message
                  </button>
                </div>
              </form>
              {successMessage && (
                <div
                  className={`${
                    successMessage.includes("error")
                      ? "text-red-500"
                      : "text-green-500"
                  } text-sm font-medium`}
                >
                  {successMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
