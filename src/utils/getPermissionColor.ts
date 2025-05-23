export const getPermissionColor = (action: string) => {
  switch (action.toLowerCase()) {
    case "create":
      return "bg-green-100 text-green-700";
    case "read":
      return "bg-blue-100 text-blue-700";
    case "update":
      return "bg-yellow-100 text-yellow-700";
    case "delete":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};
