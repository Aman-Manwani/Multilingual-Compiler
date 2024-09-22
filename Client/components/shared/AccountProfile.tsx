
const ProfileForm: React.FC = () => {

  return (
    <div className="flex items-center max-w-3xl justify-center bg-[rgb(18,20,23)] rounded-3xl">
      <div className="bg-[rgb(18,20,23)] p-4 sm:p-4 md:p-8 rounded-lg shadow-md w-full">
        <form>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 bg-[rgb(16,16,18)] text-gray-300 rounded-lg border-[1px] border-white"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-3 py-2 bg-[rgb(16,16,18)] text-gray-300 rounded-lg border-[1px] border-white"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="bio"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Bio
            </label>
            <textarea
              id="bio"
              className="w-full px-3 py-2 bg-[rgb(16,16,18)] text-gray-300 rounded-lg border-[1px] border-white"
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
