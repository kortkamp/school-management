import api from './api.service';

const getAll = async (per_page = 10, page = 1, filterBy = '', filterValue = '', filterType = '') =>
  await api.get(
    `/students?per_page=${per_page}&page=${page}&orderBy=name&orderType=ASC${
      !!filterValue ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}` : ''
    }`
  );

const create = async (data: object) => await api.post('/students', data);

const remove = async (id: object) => await api.delete('/students/' + id);

const update = async (id: string, data: object) => await api.put('/students/' + id, data);

const getById = async (id: string) => await api.get('/students/' + id);

interface IStudentResults {
  id: string;
  name: string;
  enroll_id: string;
  results: {
    exam_id: string;
    value: number;
  }[];
}

const listResults = async (class_group_id: string, subject_id: string) => {
  const response = await api.get(`/students/results?class_group_id=${class_group_id}&subject_id=${subject_id}`);

  return response.data.students as IStudentResults[];
};

export const studentsService = {
  getAll,
  create,
  remove,
  update,
  getById,
  listResults,
};
