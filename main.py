"""Uses Drive API to get folder, otherwise simply has a site for the form."""
import webapp2
import jinja2
import os
import datetime

from oauth2client.client import GoogleCredentials
from apiclient import discovery
from google.appengine.api import urlfetch

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))


class QimmiqHandler(webapp2.RequestHandler):
    """Main site."""

    def get(self):
        """Standard GET method."""
        template_values = {
        }

        template = jinja_environment.get_template('html/v2/qimmiq.html')

        self.response.out.write(template.render(template_values))


class IndexHandler(webapp2.RequestHandler):
    """Main site."""

    def get(self):
        """Standard GET method."""
        template_values = {
        }

        template = jinja_environment.get_template('html/v2/index.html')

        self.response.out.write(template.render(template_values))


class KimmichHandler(webapp2.RequestHandler):
    """Main site."""

    def get(self):
        """Standard GET method."""
        template_values = {
        }

        template = jinja_environment.get_template('html/v2/kimmich.html')

        self.response.out.write(template.render(template_values))


class GimmickHandler(webapp2.RequestHandler):
    """Main site."""

    def get(self):
        """Standard GET method."""
        template_values = {
        }

        template = jinja_environment.get_template('html/v2/gimmick.html')

        self.response.out.write(template.render(template_values))


class SpreadsheetLogger(webapp2.RequestHandler):
    """Used for logging."""

    def post(self):
        """Standard GET method."""
        urlfetch.set_default_fetch_deadline(45)

        ts = datetime.datetime.now()
        now = ts.isoformat(' ')[:-7].replace('-', '/')

        credentials = GoogleCredentials.get_application_default()

        discovery_url = ('https://sheets.googleapis.com/$discovery/rest?'
                         'version=v4')
        service = discovery.build('sheets', 'v4', credentials=credentials,
                                  discoveryServiceUrl=discovery_url)

        spreadsheet_id = '1-zOs5HcPY2DB3BLO7SwbtTUfCYUkLrM6jXJhAyodkDM'

        body = {
            'values': [
                [
                    now,  # A
                    self.request.get('username'),  # B
                    'created with V3',  # C
                    self.request.get('division'),  # D
                    'v',  # E
                    '',  # F
                    self.request.get('date_range'),  # G
                    self.request.get('conversion_action'),  # H
                    self.request.get('history_window'),  # I
                    '',  # J
                    self.request.get('total_conversions'),  # K
                    self.request.get('cd_conv_based_on_impr'),  # L
                    self.request.get('cd_conv_based_on_clck'),  # M
                    self.request.get('avg_click_path_length'),  # N
                    self.request.get('avg_impr_path_length'),  # O
                    self.request.get('unique_cd_click_paths'),  # P
                    self.request.get('unique_cd_impr_paths'),  # Q
                    self.request.get('not_ending_on_same_device'),  # R
                    self.request.get('desktop_last_click'),  # S
                    self.request.get('tablet_last_click'),  # T
                    self.request.get('mobile_last_click'),  # U
                    '',  # V
                    self.request.get('mobile_tablet'),  # W
                    self.request.get('mobile_desktop'),  # X
                    self.request.get('tablet_mobile'),  # Y
                    self.request.get('tablet_desktop'),  # Z
                    self.request.get('desktop_mobile'),  # AA
                    self.request.get('desktop_tablet'),  # AB
                    self.request.get('desktop_desktop'),  # AC
                    self.request.get('mobile_mobile'),  # AD
                    self.request.get('tablet_tablet'),  # AE
                    '',  # AF
                    self.request.get('mobile_any'),  # AG
                    self.request.get('tablet_any'),  # AH
                    self.request.get('desktop_any'),  # AI
                    '',  # AJ
                    self.request.get('mobile_start'),  # AK
                    self.request.get('tablet_start'),  # AL
                    self.request.get('desktop_start'),  # AM
                    '',  # AN
                    '',  # AO
                    self.request.get('first_mobile'),  # AP
                    self.request.get('first_tablet'),  # AQ
                    self.request.get('first_desktop'),  # AR
                    self.request.get('ushaped_mobile'),  # AS
                    self.request.get('ushaped_tablet'),  # AT
                    self.request.get('ushaped_desktop'),  # AU
                    self.request.get('linear_mobile'),  # AV
                    self.request.get('linear_tablet'),  # AW
                    self.request.get('linear_desktop'),  # AX
                    self.request.get('last_mobile'),  # AY
                    self.request.get('last_tablet'),  # AZ
                    self.request.get('last_desktop'),  # BA
                    '',  # BB
                    self.request.get('desktop_assist_ratio'),  # BC
                    self.request.get('mobile_assist_ratio'),  # BD
                    '',  # BE
                    self.request.get('total_conv_value'),  # BF
                    '',  # BG
                    '',  # BH
                    '',  # BI
                    self.request.get('total_conversion_value'),  # BJ
                    self.request.get('cd_conv_value'),  # BK
                    self.request.get('non_cd_conv_value'),  # BL
                    self.request.get('conv_value_ratio'),  # BM
                ]
            ]
        }

        service.spreadsheets().values().append(
            spreadsheetId=spreadsheet_id, range='v3Logs!A2:BM',
            valueInputOption='USER_ENTERED', insertDataOption='INSERT_ROWS',
            body=body).execute()


app = webapp2.WSGIApplication([
    ('/qimmiq', QimmiqHandler),
    ('/', KimmichHandler),
    ('/kimmich', KimmichHandler),
    ('/sheetLogger', SpreadsheetLogger)
], debug=True)
