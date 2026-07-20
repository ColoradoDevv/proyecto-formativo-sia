import { useState, useEffect } from "react";
import { getTasks } from "../services/taskService";

export default function useTasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                const data = await getTasks();
                setTasks(data);
                setError(null);
            } catch (err) {
                setError(err);
                setTasks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    return { tasks, setTasks, loading, error };
}
