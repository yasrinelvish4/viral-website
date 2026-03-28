import { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Menu, X, Heart, History, Moon, Sun } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, toggleDarkMode, isDarkMode } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
