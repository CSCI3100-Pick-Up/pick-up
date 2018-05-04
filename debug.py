from splinter import Browser

phantom_path=join('node_modules',
                  'phantomjs-prebuilt',
                  'lib',
                  'phantom',
                  'bin',
                  'phantomjs')
b = Browser('phantomjs', executable_path=phantom_path)
b.driver.set_window_size(width, height)
b.visit('http://www.example.org/')
print(b.html)
