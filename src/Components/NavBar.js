import React, {useEffect, useState} from 'react';
import '../Components/styles/navbar.scss';
import {Link, NavLink, useHistory} from 'react-router-dom';
import {Icon} from 'react-icons-kit';
import {ic_close, ic_dehaze} from 'react-icons-kit/md';

import Logo from '../assets/static/logo.png';

const NavBar = () => {
    const history = useHistory()
    let updateMassageForNav = 'This future approximately available on 05-10-2020'
    const [isOpen, setIsOpen] = useState(false);
    const [isUserLogged, setIsUserLogged] = useState(false)
    const [scrolled, setScrolled] = useState(true);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            let isTop = window.scrollY < 50;
            if (isTop !== true) {
                setScrolled(false);
            } else {
                setScrolled(true);
            }
        })
    })
    const doLogout = () => {
        localStorage.clear()
        history.push('/')
    }
    return (
        <div className={scrolled ? "nav-bar" : "nav-bar scrolled"}>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex justify-content-between">
                            <div className="title">
                                <Link to="/">
                                    <img src={Logo} className="img-fluid" alt="logo"/>
                                </Link>
                            </div>

                            {/* Page Links */}
                            <div className={isOpen ? "menu-items pt-lg-2 open-menu" : "menu-items pt-lg-2 hide-menu"}>
                                <ul>
                                    <li><NavLink activeClassName="isActive" to="/">লাইভ কোর্স করব !</NavLink></li>
                                    {/*<li><NavLink activeClassName="isActive" to="/sell-course">কোর্স কিনব !</NavLink></li>*/}
                                    <li><NavLink activeClassName="isActive" to={`/site-updating/${updateMassageForNav}`}
                                                 key={updateMassageForNav}>কোর্স কিনব !</NavLink></li>
                                    {/*<li><NavLink activeClassName="isActive" to="/offers">চলমান অফার</NavLink></li>*/}
                                    <li><NavLink activeClassName="isActive" to={`/site-updating/${updateMassageForNav}`}
                                                 key={updateMassageForNav}>চলমান অফার</NavLink></li>
                                    {/*<li><NavLink activeClassName="isActive" to="/blog">ব্লগ</NavLink></li>*/}
                                    <li><NavLink activeClassName="isActive" to={`/site-updating/${updateMassageForNav}`}
                                                 key={updateMassageForNav}>ব্লগ</NavLink></li>
                                </ul>
                            </div>

                            <div className="join d-none d-lg-block">
                                {localStorage.getItem('token') ?
                                    <Link onClick={doLogout} type="button" className="btn shadow px-4">লগ আউট</Link>
                                    : <Link to="/join" type="button" className="btn shadow px-4">জয়েন করুন</Link>
                                }

                            </div>

                            <div className="ml-auto d-lg-none">
                                <button type="button" className="btn btn-light rounded-circle shadow-none float-right d-lg-none toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                                    {isOpen ?
                                        <Icon icon={ic_close} size={25} />
                                        :
                                        <Icon icon={ic_dehaze} size={25} />
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavBar;
