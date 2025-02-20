export const Form = ({ formData = {}, setFormData = () => {}, handleSubmit = () => {} }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <form
      id="registrationForm"
      className="grid grid-cols-2 gap-4 bg-white p-6 rounded-md shadow-md w-full max-w-4xl mx-auto"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          eventName: "",
        });
      }}
    >
      <h2 className="col-span-2 text-2xl mb-4 text-center">Registeration Form</h2>
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
        className="w-full p-2 my-2 rounded-md border-2 border-gray-300"
        required
      />
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        className="w-full p-2 my-2 rounded-md border-2 border-gray-300"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 my-2 rounded-md border-2 border-gray-300"
        required
      />
      <input
        type="text"
        name="eventName"
        placeholder="Event Name"
        value={formData.eventName}
        onChange={handleChange}
        className="w-full p-2 my-2 rounded-md border-2 border-gray-300"
        required
      />
      <button className="col-span-2 bg-blue-500 text-white p-2 rounded-md mt-4">
        Register
      </button>
    </form>
  );
};
