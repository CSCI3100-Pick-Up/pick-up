# Pick-up --- Web application to connect students
# Copyright © 2018 Alex Vong <alexvong1995@gmail.com>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.


'''
Blackbox testing for Pick-up.
'''


from filecmp import cmp
from pymongo import MongoClient
from glob import glob
from os import remove
from os.path import abspath
from os.path import join
from shutil import which
from splinter import Browser
from subprocess import call


client = MongoClient()
db = client['csci3100PickUp']
scheds = db['schedules']
users = db['users']


def initdb():
    return call([which('node'), "initdb.js"])


def make_browser(phantom_path=join('node_modules',
                                   'phantomjs-prebuilt',
                                   'bin',
                                   'phantomjs'),
                 width=1920,
                 height=1080):
    b = Browser('phantomjs', executable_path=phantom_path)
    b.driver.set_window_size(width, height)
    return b


def is_home_page(page):
    return page.is_element_present_by_id('login')


def is_signup_page(page):
    return page.is_element_present_by_id('signup')


def is_schedule_page(page):
    return page.is_element_present_by_id('myScheduler')


def is_profile_page(page):
    return page.is_element_present_by_css('[class="user-name"]')


def is_matches_page(page):
    h1 = page.find_by_tag('h1')
    return h1 and h1.text == 'Matches'


def is_chatroom_page(page):
    return page.is_element_present_by_id('rooms')


def is_report_page(page):
    return page.is_element_present_by_id('userDropdown')


def user_exists(username, email):
    return users.find_one({'username': username, 'email': email})


def sched_exists(email, activity):
    return scheds.find_one({'owner': email_to_oid(email),
                            'content': activity})


def email_to_oid(email):
    auth = users.find_one({'email': email})
    return auth['_id']


def custom_image_saved(img,
                       default_dir=abspath(join('public', 'img')),
                       default_img=abspath(join('public', 'img',
                                                'default.png'))):
    abs_img = abspath(img)
    return any(cmp(img, abs_img)
               for img in glob(join(default_dir, '*'))
               if img != default_img)


def delete_custom_images(default_dir=abspath(join('public', 'img')),
                         default_img=abspath(join('public', 'img',
                                                  'default.png'))):
    for img in glob(join(default_dir, '*')):
        if img != default_img:
            remove(img)


def body(page):
    return page.find_by_tag('body').text


def span(page):
    return page.find_by_tag('span').text


def empty_cols(page):
    return page.find_by_css('[class="scheduler-view-day-table-col-shim"]')


def filled_cols(page):
    return page.find_by_css('[class="scheduler-event-content"]')


def home_button(page):
    return page.find_by_css('[class="navbar-brand "]')


def options_button(page):
    return page.find_by_id('navbarDropdown')


def visit(url):
    b = make_browser()
    b.visit(url)
    return b


def login(email, password):
    b = visit('http://localhost:8081')
    b.fill('email', email)
    b.fill('password', password)
    b.click_link_by_id('login')
    return b


def home(email, password):
    b = login(email, password)
    home_button(b).click()
    return b


def profile(email, password):
    b = login(email, password)
    b.click_link_by_href('/profile')
    return b


def upload(b, img):
    b.attach_file('myfile', img)
    b.find_by_value('Upload').click()


def schedule(email, password):
    b = login(email, password)
    b.click_link_by_href('/schedule')
    return b


def matches(email, password):
    b = login(email, password)
    b.click_link_by_href('/matches')
    return b


def chatroom(email, password):
    b = login(email, password)
    b.click_link_by_href('/chatroom')
    return b


def report(email, password):
    b = login(email, password)
    options_button(b).click()
    options_button(b).click()
    b.click_link_by_href('/report')
    return b


def logout(b):
    b.execute_script(b.find_by_tag('script')[-1].html.replace('let', 'var'))
    b.click_link_by_href('/logout')


def signup(username, email, password, confirm):
    b = visit('http://localhost:8081')
    b.click_link_by_href('/signUp')
    b.fill('username', username)
    b.fill('email', email)
    b.fill('password', password)
    b.fill('confirm', confirm)
    b.click_link_by_id('signup')
    return b


def add_events(email, password, events):
    b = schedule(email, password)
    for k in range(len(events)):
        empty_cols(b)[k].click()
        b.fill('content', events[k])
        b.find_by_text('Save').click()
        b.reload()
    return b


def edit_events(b, events):
    for k in range(len(events)):
        filled_cols(b)[k].click()
        b.fill('content', events[k])
        b.find_by_text('Save').click()
        b.reload()


def remove_events(b):
    for k in range(len(filled_cols(b))):
        filled_cols(b).first.click()
        b.find_by_text('Delete').click()
        b.reload()


def test_redirections():
    with visit('http://localhost:8081') as b:
        assert(is_home_page(b))

    with visit('http://localhost:8081/admin') as b:
        assert(is_home_page(b))

    with visit('http://localhost:8081/loggedIn') as b:
        assert(body(b) == 'false')

    with visit('http://localhost:8081/login') as b:
        assert(body(b) == 'Cannot GET /login')

    with visit('http://localhost:8081/sign') as b:
        assert(body(b) == 'Cannot GET /sign')

    with visit('http://localhost:8081/schedule') as b:
        assert(is_home_page(b))

    with visit('http://localhost:8081/schedule/getschedule') as b:
        assert(is_home_page(b))

    with visit('http://localhost:8081/schedule/newschedule') as b:
        assert(body(b) == 'false')

    with visit('http://localhost:8081/schedule/updateschedule') as b:
        assert(body(b) == 'false')

    with visit('http://localhost:8081/schedule/deleteschedule') as b:
        assert(body(b) == 'false')

    with visit('http://localhost:8081/signUp') as b:
        assert(is_signup_page(b))

    with visit('http://localhost:8081/profile') as b:
        assert(is_home_page(b))

    with visit('http://localhost:8081/matches') as b:
        assert(is_home_page(b))

    with visit('http://localhost:8081/logout') as b:
        assert(is_home_page(b))

    with visit('http://localhost:8081/report') as b:
        assert(is_home_page(b))

    with visit('http://localhost:8081/chatroom') as b:
        assert(is_home_page(b))

    with visit('http://localhost:8081/upload') as b:
        assert(body(b) == 'Cannot GET /upload')

    with visit('http://localhost:8081/' + 'does-not-exist') as b:
        assert(body(b) == 'Cannot GET /' + 'does-not-exist')


def test_login():
    with login('john@cuhk.edu.hk', '123') as b:
        assert(is_schedule_page(b))

    with login('john@cuhk.edu.hk', '1234') as b:
        assert(span(b) == 'Incorrect email or password! Please try again.')

    with login('john@cuhk.edu', '123') as b:
        assert(span(b) == 'Incorrect email or password! Please try again.')


def test_logout():
    with login('john@cuhk.edu.hk', '123') as b:
        logout(b)
        assert(is_home_page(b))


def test_signup():
    def test1():
        with signup('foo', 'foo@cuhk.edu.hk', 'bar', 'bar')  as b:
            assert(is_home_page(b))
            assert(user_exists('foo', 'foo@cuhk.edu.hk'))
            initdb()

    def test2():
        with signup('john', 'foo@cuhk.edu.hk', 'bar', 'bar') as b:
            assert(is_home_page(b))
            assert(user_exists('john', 'foo@cuhk.edu.hk'))
            initdb()

    def test3():
        with signup('foo', 'john@cuhk.edu.hk', 'bar', 'bar') as b:
            assert(span(b) == 'The user already exists! Please try login.')
            initdb()

    def test4():
        with signup('foo', 'foo@cuhk.edu.hk', 'bar', 'baz') as b:
            assert(is_signup_page)
            initdb()

    test1()
    #test2() # xfail
    test3()
    test4()


def test_nav_bar():
    with home('john@cuhk.edu.hk', '123') as b:
        assert(is_profile_page(b))

    with profile('john@cuhk.edu.hk', '123') as b:
        assert(is_profile_page(b))

    with schedule('john@cuhk.edu.hk', '123') as b:
        assert(is_schedule_page(b))

    with matches('john@cuhk.edu.hk', '123') as b:
        assert(is_matches_page(b))

    with chatroom('john@cuhk.edu.hk', '123') as b:
        assert(is_chatroom_page(b))

    with report('john@cuhk.edu.hk', '123') as b:
        assert(is_report_page(b))


def test_schedule():
    with add_events('john@cuhk.edu.hk',
                    '123',
                    ['event-' + str(k) for k in range(7)]) as b:
        assert(all(sched_exists('john@cuhk.edu.hk', 'event-' + str(k))
                   for k in range(7)))

        edit_events(b, ['event*-' + str(k) for k in range(7)])
        assert(all(sched_exists('john@cuhk.edu.hk', 'event*-' + str(k))
                   for k in range(7)))

        remove_events(b)
        assert(all(not sched_exists('john@cuhk.edu.hk', 'event*-' + str(k))
                   for k in range(7)))

        initdb()


def test_profile():
    with profile('john@cuhk.edu.hk', '123') as b:
        img = join('public',
                   'thumbnail-images',
                   'Profile-avatar-placeholder-large.png')
        upload(b, img)
        assert(custom_image_saved(img))
        delete_custom_images()
        initdb()

    with profile('john@cuhk.edu.hk', '123') as b:
        b.click_link_by_partial_text('View Interests and Edit Schedule')
        assert(is_schedule_page(b))


def test_matches():
    def test1():
        add_events('john@cuhk.edu.hk', '123', ['event'])
        add_events('jane@cuhk.edu.hk', '123', ['event'])
        with matches('john@cuhk.edu.hk', '123') as b:
            last_row = b.find_by_tag('tr')[-3].find_by_tag('td')
            assert(last_row[0] == 'event')
            assert(last_row[1] == 'jane')
            last_row[2].click()
            assert(is_chatroom_page(b))


initdb()
test_redirections()
test_login()
test_logout()
test_signup()
test_nav_bar()
test_schedule()
test_profile()
test_matches()
