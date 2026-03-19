
import React from 'react';
import { 
  Users, 
  Music, 
  Heart, 
  BookOpen, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react';
import { NavItem, ServiceTime, Ministry, Event } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Ministries', path: '/ministries' },
  { label: 'Sermons', path: '/sermons' },
  { label: 'Events', path: '/events' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' }
];

export const SERVICE_TIMES: ServiceTime[] = [
  { day: 'Sundays', time: '8:00 AM - 10:30 AM', description: 'Morning Worship & Liturgy' },
  { day: 'Wednesdays', time: '6:00 PM - 7:30 PM', description: 'Mid-week Bible Study' },
  { day: 'Fridays', time: '7:00 PM - 8:30 PM', description: 'Prayer & Intercession' }
];

export const MINISTRIES: Ministry[] = [
  {
    id: '1',
    title: 'Worship & Music',
    description: 'Our vibrant choir leads the congregation in uplifting hymns and contemporary worship.',
    image: 'https://picsum.photos/seed/worship/600/400'
  },
  {
    id: '2',
    title: 'Youth Ministry',
    description: 'Empowering the next generation through word, fellowship, and community impact.',
    image: 'https://picsum.photos/seed/youth/600/400'
  },
  {
    id: '3',
    title: 'Children’s Ministry',
    description: 'Nurturing our little ones in the knowledge and love of Jesus Christ.',
    image: 'https://picsum.photos/seed/kids/600/400'
  },
  {
    id: '4',
    title: 'Women’s Fellowship',
    description: 'A sisterhood dedicated to spiritual growth and supporting the needs of the church.',
    image: 'https://picsum.photos/seed/women/600/400'
  }
];

export const UPCOMING_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Annual Harvest Festival',
    date: 'Dec 15, 2024',
    location: 'Main Sanctuary',
    category: 'Celebration'
  },
  {
    id: 'e2',
    title: 'Community Health Screening',
    date: 'Jan 10, 2025',
    location: 'Church Forecourt',
    category: 'Outreach'
  },
  {
    id: 'e3',
    title: 'Youth Leadership Summit',
    date: 'Feb 05, 2025',
    location: 'Conference Hall',
    category: 'Training'
  }
];

export const SOCIAL_LINKS = [
  { icon: <Facebook className="w-5 h-5" />, href: '#' },
  { icon: <Twitter className="w-5 h-5" />, href: '#' },
  { icon: <Instagram className="w-5 h-5" />, href: '#' },
  { icon: <Youtube className="w-5 h-5" />, href: '#' }
];
