
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simple mock login logic
        setTimeout(() => {
            if (username === 'admin' && password === 'admin') {
                navigate('/Home');
            } else {
                alert('Invalid credentials (use admin/admin)');
            }
            setIsLoading(false);
        }, 500);
    };

    return {
        username,
        setUsername,
        password,
        setPassword,
        handleLogin,
        isLoading
    };
};
