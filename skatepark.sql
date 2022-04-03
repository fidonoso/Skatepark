--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.1

-- Started on 2022-04-03 03:58:38

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3305 (class 0 OID 24967)
-- Dependencies: 210
-- Data for Name: skaters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.skaters (id, email, nombre, password, anos_experiencia, especialidad, foto, estado, tipo) FROM stdin;
1	fidonoso@gmail.com	Fernando Donoso	desafio1234	1	desarrollo	/img/admin.png	t	admin
2	desafiolatam@gmail.com	Desafio latam	1234	20	Academia	/img/academia.jpg	f	user
\.


--
-- TOC entry 3312 (class 0 OID 0)
-- Dependencies: 209
-- Name: skaters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.skaters_id_seq', 2, true);


-- Completed on 2022-04-03 03:58:38

--
-- PostgreSQL database dump complete
--

