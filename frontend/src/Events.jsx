export const Event = ({ eventList, isCache, handleDelete }) => {
  return (
    <div className="p-4">
      <h3 className="text-2xl font-bold text-center mb-6">
        Event Registration List{" "}
        <span className="text-sm text-gray-500">({eventList?.length})</span>
        <span className={isCache ? "text-red-500" : "text-green-500"}>
          {isCache ? " cached" : " live"}
        </span>
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">ID</th>
              <th className="py-2 px-4 border-b text-left">First Name</th>
              <th className="py-2 px-4 border-b text-left">Last Name</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Event Name</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {eventList?.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{event.id}</td>
                <td className="py-2 px-4 border-b">{event.firstName}</td>
                <td className="py-2 px-4 border-b">{event.lastName}</td>
                <td className="py-2 px-4 border-b">{event.email}</td>
                <td className="py-2 px-4 border-b">{event.eventName}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
