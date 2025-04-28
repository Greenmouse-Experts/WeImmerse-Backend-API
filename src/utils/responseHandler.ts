interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

export const sendResponse = <T>(
  res: Response | any,
  statusCode: number,
  data?: T,
  message?: string,
  errors?: any[]
) => {
  const response: ApiResponse<T> = {
    success: statusCode >= 200 && statusCode < 300,
  };

  if (data) response.data = data;
  if (message) response.message = message;
  if (errors) response.errors = errors;

  res.status(statusCode).json(response);
};
