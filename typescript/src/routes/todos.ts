import { Router, Request, Response, NextFunction }  from 'express';
import { Todo } from '../models/todo';

let todos : Todo[] = [];

type RequestBody = { text : string};
type RequestParams = { todoId : string};

const router = Router();

router.get('/', (req : Request, res :  Response, next : NextFunction) => {
    res.status(200).json({ todos : todos});
});

router.post('/todo', (req : Request, res : Response, next : NextFunction) : any => {
    const body = req.body as RequestBody
    const newTodo : Todo = {
        id : new Date().toISOString(),
        text : body.text
    };
    todos.push(newTodo);

    return res.status(201).json({ message : 'Added todo', todos : newTodo});
});

router.put('/todo/:todoId', (req : Request, res: Response, next : NextFunction) : any => {
    const params = req.params as RequestParams;
    const tid = params.todoId;
    const body = req.body as RequestBody
    const todoIndex = todos.findIndex(todoItem => todoItem.id === tid);
    if(todoIndex >= 0) {
        todos[todoIndex] = { id : todos[todoIndex].id, text : body.text};
        return res.status(200).json({ message : 'Updated todo', todos : todos});
    }
    res.status(404).json({ message : 'Could not find todo for this id.'});
});

router.delete('/todo/:todoId', (req : Request, res : Response, next : NextFunction) => {
    const params = req.params as RequestParams;
    todos = todos.filter(todoItem => todoItem.id !== params.todoId);
    res.sendStatus(200).json({ message : 'Deleted todo', todos : todos });
});

export default router;