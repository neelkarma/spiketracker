export const load = ({ fetch }) =>
  fetch("/api/auth/status").then((res) => res.json());
