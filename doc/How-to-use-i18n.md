How to use the Multi-Language Support

We are using the i18next framework for the implementation of the language selection in our app.

The i18n.ts file
In this file we define all the different languages which we are supporting.

Json files
Each language needs its own Json file.
Structure of the Json file:

{
“NameOfComponent” : {
“NameOfTheString”: “String”
}
}

If a new String is added to the translation, the String needs to be added in each Language Json file

If the new sting is used in a Button, please add the “btn-” präfix

I created a common part in each of the Json files where we can add Translation of common sentences, so we don't have to add it to each Component individually. Like Yes or No.

I created the LanguageSelection.tsx file, which provides a DropDown Menu for the language selection. The file can be imported and the <LanguageSelection /> can be used to place the DropDown Menu.

Add Multilanguage support to Component
Import:
import { useTranslation } from "react-i18next"

Add constant:
const { t } = useTranslation()

Add DropDown at the desired spot:
<LanguageSelector />
Access the language string
label={t("Login.choseProvider")}
