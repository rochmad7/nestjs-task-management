import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  username: 'lala',
  id: 'huidwq',
  password: '3udbqycadjl',
  tasks: [],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns an array of tasks', async () => {
      tasksRepository.getTasks.mockResolvedValue('some-tasks');
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual('some-tasks');
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.findOne and returns a task', async () => {
      const mockTask = {
        title: 'title',
        description: 'description',
        id: 'id',
        status: TaskStatus.OPEN,
      };

      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('id', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.findOne and handles an error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      await expect(tasksService.getTaskById('id', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
