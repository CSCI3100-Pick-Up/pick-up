from os.path import join
from splinter import Browser

b = Browser('phantomjs', executable_path=join('node_modules',
                                              'phantomjs-prebuilt',
                                              'lib',
                                              'phantom',
                                              'bin',
                                              'phantomjs'))
b.driver.set_window_size(1920, 1080)
b.visit('http://localhost:8081/')
print(b.html)
